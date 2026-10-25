const FILES = __FILES__;
const EDITION = "__EDITION__";
const CACHE = `haidao-${EDITION}`;
const root = new URL("./", self.location.href);
const hex = (data) =>
  Array.from(new Uint8Array(data), (b) => b.toString(16).padStart(2, "0")).join("");
let rebuilding;
async function fillEdition() {
  if (rebuilding) return rebuilding;
  rebuilding = (async () => {
    // Fetch all verified bytes before changing a usable cache. Wait for every
    // request, including failures, before cleanup can run.
    const entries = Object.entries(FILES);
    const fetched = await Promise.allSettled(
      entries.map(async ([name, hash]) => {
        const integrity = `sha256-${btoa(String.fromCharCode(...hash.match(/../g).map((v) => Number.parseInt(v, 16))))}`;
        const response = await fetch(
          new Request(new URL(name, root), { cache: "reload", integrity }),
        );
        if (!response.ok) throw new Error("Incomplete edition");
        return response;
      }),
    );
    if (fetched.some((result) => result.status === "rejected"))
      throw new Error("An edition file could not be verified. The offline copy was not rebuilt.");
    await caches.delete(CACHE);
    const cache = await caches.open(CACHE);
    const stored = await Promise.allSettled(
      fetched.map((result, index) => {
        if (result.status !== "fulfilled") throw new Error("Unverified response");
        return cache.put(new URL(entries[index][0], root), result.value);
      }),
    );
    if (stored.some((result) => result.status === "rejected")) {
      await caches.delete(CACHE);
      throw new Error("The complete edition could not be stored.");
    }
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
      const cache = (await caches.has(CACHE)) ? await caches.open(CACHE) : null;
      const hit = cache ? await cache.match(new URL(name, root)) : null;
      return hit || fetch(event.request);
    })(),
  );
});
self.addEventListener("message", (event) => {
  if (!event.ports[0]) return;
  if (event.data?.type === "repair") {
    event.waitUntil(
      (async () => {
        try {
          await fillEdition();
          event.ports[0].postMessage({ edition: EDITION, repaired: true });
        } catch (error) {
          event.ports[0].postMessage({ edition: EDITION, repaired: false, error: error.message });
        }
      })(),
    );
    return;
  }
  if (event.data?.type !== "inventory") return;
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      const missing = [];
      // Inspection must not create an empty cache and then claim it is ready.
      if (!names.includes(CACHE)) missing.push(...Object.keys(FILES));
      else {
        const cache = await caches.open(CACHE);
        for (const [name, hash] of Object.entries(FILES)) {
          const hit = await cache.match(new URL(name, root));
          if (!hit || hex(await crypto.subtle.digest("SHA-256", await hit.arrayBuffer())) !== hash)
            missing.push(name);
        }
      }
      event.ports[0].postMessage({
        edition: EDITION,
        files: Object.keys(FILES).length,
        missing,
        ready: missing.length === 0,
      });
    })(),
  );
});
