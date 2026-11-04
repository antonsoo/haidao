const FILES = __FILES__;
const EDITION = "__EDITION__";
const CACHE = `haidao-${EDITION}`;
const root = new URL("./", self.location.href);
// The same streamed, bounded, inactivity-aware verifier is used by the reader.
__TRANSFER__;
const hex = (data) =>
  Array.from(new Uint8Array(data), (b) => b.toString(16).padStart(2, "0")).join("");
const listeners = new Set();
let rebuilding;
let progress = { received: 0, total: Object.values(FILES).reduce((n, f) => n + f.bytes, 0) };
async function announce(type, details = {}) {
  for (const client of await self.clients.matchAll({ includeUncontrolled: true, type: "window" })) {
    if (client.url.startsWith(root.href))
      client.postMessage({ type, edition: EDITION, ...details });
  }
}
function report(received) {
  progress = { ...progress, received };
  for (const listener of listeners) listener(progress);
}
async function cached(name) {
  if (!(await caches.has(CACHE))) return null;
  const cache = await caches.open(CACHE);
  const hit = await cache.match(new URL(name, root));
  if (!hit) return null;
  const bytes = await hit.clone().arrayBuffer();
  const expected = FILES[name];
  if (
    bytes.byteLength === expected.bytes &&
    hex(await crypto.subtle.digest("SHA-256", bytes)) === expected.sha256
  )
    return hit;
  await cache.delete(new URL(name, root));
  return null;
}
async function inventory() {
  const missing = [];
  for (const name of Object.keys(FILES)) {
    try {
      if (!(await cached(name))) missing.push(name);
    } catch {
      missing.push(name);
    }
  }
  return {
    edition: EDITION,
    files: Object.keys(FILES).length,
    missing,
    ready: missing.length === 0,
  };
}
async function fillEdition() {
  if (rebuilding) return rebuilding;
  rebuilding = (async () => {
    await announce("haidao-repairing");
    report(0);
    const entries = Object.entries(FILES);
    let next = 0,
      completedBytes = 0;
    const active = new Map();
    const errors = [];
    // Two background transfers leave foreground source reading usable. Already
    // verified files remain available if a later transfer or storage write fails.
    async function lane() {
      while (next < entries.length) {
        const [name, expected] = entries[next++];
        try {
          const existing = await cached(name);
          if (!existing) {
            const response = await verifiedResponse(new URL(name, root), expected, {
              cache: "reload",
              onProgress(received) {
                active.set(name, received);
                report(completedBytes + [...active.values()].reduce((a, b) => a + b, 0));
              },
            });
            const cache = await caches.open(CACHE);
            await cache.put(new URL(name, root), response);
          }
          active.delete(name);
          completedBytes += expected.bytes;
          report(completedBytes + [...active.values()].reduce((a, b) => a + b, 0));
        } catch (error) {
          active.delete(name);
          errors.push(error);
        }
      }
    }
    await Promise.all([lane(), lane()]);
    const result = await inventory();
    if (errors.length || !result.ready) {
      const reason =
        errors[0]?.message ??
        "The complete edition could not be stored. Retry to repair missing files.";
      await announce("haidao-incomplete", { missing: result.missing.length, reason });
      throw new Error(reason);
    }
    await announce("haidao-repaired");
  })();
  try {
    await rebuilding;
  } finally {
    rebuilding = undefined;
  }
}
self.addEventListener("install", (event) =>
  event.waitUntil(
    (async () => {
      await fillEdition();
      await self.skipWaiting();
    })(),
  ),
);
self.addEventListener("activate", (event) =>
  event.waitUntil(
    (async () => {
      await self.clients.claim();
      for (const name of await caches.keys())
        if (name.startsWith("haidao-") && name !== CACHE) await caches.delete(name);
    })(),
  ),
);
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (
    event.request.method !== "GET" ||
    url.origin !== root.origin ||
    !url.pathname.startsWith(root.pathname)
  )
    return;
  const name = url.pathname.slice(root.pathname.length) || "index.html";
  if (!Object.hasOwn(FILES, name)) return;
  event.respondWith(
    (async () => {
      const hit = await cached(name);
      if (hit) return hit;
      await announce("haidao-incomplete");
      // A missing/corrupt file must never bypass verification on its network path.
      const response = await verifiedResponse(new URL(name, root), FILES[name], {
        signal: event.request.signal,
      });
      return response;
    })(),
  );
});
self.addEventListener("message", (event) => {
  const port = event.ports[0];
  if (!port) return;
  if (event.data?.edition !== EDITION) {
    port.postMessage({
      edition: EDITION,
      repaired: false,
      error: "The page and offline controller differ. Reload the current page before rebuilding.",
    });
    return;
  }
  if (event.data.type === "repair") {
    event.waitUntil(
      (async () => {
        const listener = (value) =>
          port.postMessage({ edition: EDITION, type: "progress", ...value });
        listeners.add(listener);
        listener(progress);
        try {
          await fillEdition();
          port.postMessage({ edition: EDITION, repaired: true });
        } catch (error) {
          port.postMessage({ edition: EDITION, repaired: false, error: error.message });
        } finally {
          listeners.delete(listener);
        }
      })(),
    );
  } else if (event.data.type === "inventory") {
    event.waitUntil(
      (async () => {
        const result = await inventory();
        if (!result.ready) await announce("haidao-incomplete", { missing: result.missing.length });
        port.postMessage(result);
      })(),
    );
  }
});
