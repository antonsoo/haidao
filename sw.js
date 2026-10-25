const FILES = {"assets/index-ih6VYFxP.js":"773c6c21dd33333c180d0560534b21fbac29bef3dc309e6b372842a8ce9b18f1","assets/index-tMdykEIH.css":"c2d1886c26e8c0ab5aa49f615ae28498bfb7a9421a81ef7ddc90fffae988dc7a","favicon.svg":"d643c8d70cb63f8202d3ee4b959f22ae8b7f12978b4206bc1af669cdbb125058","fonts/Atkinson-OFL.txt":"aca6a428580965d2297d1b718042dd427c2a9443ece3b0d02d758e161e0c4030","fonts/AtkinsonHyperlegibleNext.ttf":"5a455d1cfa099b601ab70751bb9673e8fe1854dc4500c80e1a220d0d75e31745","fonts/HaidaoCJK.woff2":"27a27fb302131881c0f1a600f6b62989a44622748490b36c57f11a7df456edaf","fonts/Noto-NOTICE.txt":"f0aeeb7b1cf3c018211e235091ad316e184e8d3bdac3922b03dca9598451d1ec","fonts/Noto-OFL.txt":"6a73f9541c2de74158c0e7cf6b0a58ef774f5a780bf191f2d7ec9cc53efe2bf2","fonts/characters.txt":"4ad5a7fbd124841f41e752ab50b23f1563b3ca1dd37c15d45b4bdfdd1960ed4c","fonts/provenance.json":"ad16696e82aa2e31a8b11d76316245a2c64e4e8a5832042b9289b54a29446664","index.html":"3331d31e5b213d8856588deeace69cd65c629686305f609c73d1f14120ca7587","source-manifest.json":"1d03e1123b42bf82fc3e9f8fa762325ec682063e9c9f1e79dc704f6e6662931f","sources/waseda-09.jpg":"bded88b54aad386512ddc06b8e28c5a37f6ae490558646013d597aaca9f27f43","sources/waseda-10.jpg":"2e2169694a4bc17830dc8415f5af3681fd2649fdd040c6bd51a36be47edbc3be","sources/waseda-11.jpg":"620dd0b10c6f195385d9c2484cf42bac798d5006e7533fc282febd3f253d2db0","sources/waseda-12.jpg":"40b8b9dc5ef1f2e9bb3e8a4218117a15a49d47abe21568f29f47e125fbbada4e","sources/waseda-13.jpg":"f460c01cc2aaba138cc779698996bba9a8b44aec76f20f7f5d17dad382c918c4","sources/waseda-metadata.json":"c34ac06a8920c62ea271561180e5ff089bdb06ba5972b5d1b874e91edd9b2341"};
const EDITION = "aac63ce5dd7f3cf9a93a";
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
