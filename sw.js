const FILES = {"assets/index-C-39hrMN.css":{"bytes":10683,"sha256":"185768ef0b0fa8b5b57ff57c209a3ce7c99992b13a8019c469a238002cdc8738"},"assets/index-uwR9ZuhD.js":{"bytes":61591,"sha256":"0d8b259bdfd420e83ba5409e2e11704861c94ed86546386212ae37144e05204b"},"favicon.svg":{"bytes":283,"sha256":"d643c8d70cb63f8202d3ee4b959f22ae8b7f12978b4206bc1af669cdbb125058"},"fonts/Atkinson-OFL.txt":{"bytes":4431,"sha256":"aca6a428580965d2297d1b718042dd427c2a9443ece3b0d02d758e161e0c4030"},"fonts/AtkinsonHyperlegibleNext.ttf":{"bytes":114552,"sha256":"5a455d1cfa099b601ab70751bb9673e8fe1854dc4500c80e1a220d0d75e31745"},"fonts/HaidaoCJK.woff2":{"bytes":44284,"sha256":"27a27fb302131881c0f1a600f6b62989a44622748490b36c57f11a7df456edaf"},"fonts/Noto-NOTICE.txt":{"bytes":118,"sha256":"f0aeeb7b1cf3c018211e235091ad316e184e8d3bdac3922b03dca9598451d1ec"},"fonts/Noto-OFL.txt":{"bytes":4301,"sha256":"6a73f9541c2de74158c0e7cf6b0a58ef774f5a780bf191f2d7ec9cc53efe2bf2"},"fonts/characters.txt":{"bytes":399,"sha256":"4ad5a7fbd124841f41e752ab50b23f1563b3ca1dd37c15d45b4bdfdd1960ed4c"},"fonts/provenance.json":{"bytes":344,"sha256":"ad16696e82aa2e31a8b11d76316245a2c64e4e8a5832042b9289b54a29446664"},"index.html":{"bytes":18024,"sha256":"c0483187b872fd096bca47908e0d2d7ceb1122fc266f9c5310f3f2f9cac8a69a"},"source-manifest.json":{"bytes":2794,"sha256":"657dc24c0291a3cf9d78f982291a9acd8fb09e164ae7b289864a6286a80ae5a8"},"sources/waseda-09.jpg":{"bytes":944202,"sha256":"bded88b54aad386512ddc06b8e28c5a37f6ae490558646013d597aaca9f27f43"},"sources/waseda-10.jpg":{"bytes":796216,"sha256":"2e2169694a4bc17830dc8415f5af3681fd2649fdd040c6bd51a36be47edbc3be"},"sources/waseda-11.jpg":{"bytes":1018547,"sha256":"620dd0b10c6f195385d9c2484cf42bac798d5006e7533fc282febd3f253d2db0"},"sources/waseda-12.jpg":{"bytes":982697,"sha256":"40b8b9dc5ef1f2e9bb3e8a4218117a15a49d47abe21568f29f47e125fbbada4e"},"sources/waseda-13.jpg":{"bytes":1010533,"sha256":"f460c01cc2aaba138cc779698996bba9a8b44aec76f20f7f5d17dad382c918c4"},"sources/waseda-metadata.json":{"bytes":2294,"sha256":"c34ac06a8920c62ea271561180e5ff089bdb06ba5972b5d1b874e91edd9b2341"}};
const EDITION = "9dc90b12e68d81e011fa";
const CACHE = `haidao-${EDITION}`;
const root = new URL("./", self.location.href);
// The same streamed, bounded, inactivity-aware verifier is used by the reader.
/**
 * Read and verify one retained file. The clock measures inactivity, not total
 * transfer time. This dependency-free function is also embedded in the worker.
 */
async function verifiedResponse(url, expected, options = {}) {
  const abort = new AbortController();
  const signal = options.signal ? AbortSignal.any([options.signal, abort.signal]) : abort.signal;
  let timer;
  const arm = () => {
    clearTimeout(timer);
    timer = setTimeout(
      () =>
        abort.abort(
          new DOMException(
            "No data arrived for 15 seconds. Check the connection and retry.",
            "TimeoutError",
          ),
        ),
      15000,
    );
  };
  arm();
  let reader;
  try {
    const response = await fetch(url, { cache: options.cache ?? "no-cache", signal });
    if (!response.ok) throw new Error(`Could not load the retained file (${response.status}).`);
    arm();
    reader = response.body?.getReader();
    if (!reader) throw new Error("The retained file has no readable body.");
    const bytes = new Uint8Array(expected.bytes);
    let received = 0;
    options.onProgress?.(0, expected.bytes);
    for (;;) {
      const { done, value } = await reader.read();
      signal.throwIfAborted();
      if (done) break;
      arm();
      if (received + value.length > expected.bytes)
        throw new Error("The identity check failed: the retained file is larger than expected.");
      bytes.set(value, received);
      received += value.length;
      options.onProgress?.(received, expected.bytes);
    }
    clearTimeout(timer);
    signal.throwIfAborted();
    const digest = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)), (b) =>
      b.toString(16).padStart(2, "0"),
    ).join("");
    if (received !== expected.bytes || digest !== expected.sha256)
      throw new Error(
        "The identity check failed for the retained file. Reload or retry with the complete edition.",
      );
    signal.throwIfAborted();
    const headers = new Headers(response.headers);
    // Fetch has already decoded a compressed HTTP body. Retain its actual bytes.
    headers.delete("content-encoding");
    headers.set("content-length", String(received));
    return new Response(bytes, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } catch (error) {
    abort.abort(error);
    if (reader) await reader.cancel().catch(() => {});
    throw signal.reason ?? error;
  } finally {
    clearTimeout(timer);
    reader?.releaseLock();
  }
}
;
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
