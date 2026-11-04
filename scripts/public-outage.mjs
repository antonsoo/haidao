import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { connect } from "node:net";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium, firefox } from "playwright";

// Actual public TLS is tunneled unchanged, then every tunnel is destroyed and
// new ones refused. No browser offline emulation, route fulfillment or TLS bypass.
const base = "https://antonsoo.github.io/haidao/";
const out = path.resolve(process.argv[2] ?? "/tmp/haidao-public-outage");
await mkdir(out, { recursive: true });
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");
const files = new Map();
async function collect(folder) {
  for (const item of await readdir(folder, { withFileTypes: true })) {
    const filename = path.join(folder, item.name);
    if (item.isDirectory()) await collect(filename);
    else
      files.set(
        path.relative("dist", filename).split(path.sep).join("/"),
        await readFile(filename),
      );
  }
}
await collect("dist");
const edition = files
  .get("sw.js")
  .toString()
  .match(/const EDITION = "([a-f0-9]+)"/)[1];
const expected = Object.fromEntries(
  [...files].filter(([name]) => name !== "sw.js").map(([name, bytes]) => [name, sha(bytes)]),
);
const sockets = new Set();
let blocked = false,
  refused = 0,
  forwarded = 0;
function track(socket) {
  sockets.add(socket);
  socket.on("close", () => sockets.delete(socket));
  socket.on("error", () => socket.destroy());
  return socket;
}
function disconnect() {
  blocked = true;
  for (const socket of sockets) socket.destroy();
}
const server = createServer((_req, res) => res.writeHead(502).end());
server.on("connection", track);
server.on("connect", (req, client, head) => {
  if (blocked || req.url !== "antonsoo.github.io:443") {
    if (req.url === "antonsoo.github.io:443") refused++;
    client.end("HTTP/1.1 502 Bad Gateway\r\nConnection: close\r\n\r\n");
    return;
  }
  const remote = track(connect({ host: "antonsoo.github.io", port: 443 }));
  remote.setTimeout(30000, () => remote.destroy());
  remote.on("error", () => client.destroy());
  remote.on("close", () => client.destroy());
  client.on("close", () => remote.destroy());
  remote.on("data", (bytes) => {
    forwarded += bytes.length;
  });
  remote.once("connect", () => {
    if (blocked) {
      remote.destroy();
      client.destroy();
      return;
    }
    client.write("HTTP/1.1 200 Connection Established\r\n\r\n");
    if (head.length) remote.write(head);
    remote.pipe(client);
    client.pipe(remote);
  });
});
async function ready(page) {
  await page.waitForFunction(
    (edition) =>
      document.querySelector("#offline-status").textContent.includes(edition) &&
      document.querySelector("#offline-status").textContent.includes("Ready for an offline reload"),
    edition,
    { timeout: 60000 },
  );
  assert.ok(await page.evaluate(() => Boolean(navigator.serviceWorker.controller)));
}
async function inventory(page) {
  return page.evaluate(async (expected) => {
    const names = (await caches.keys()).filter((n) => n.startsWith("haidao-"));
    if (names.length !== 1) return false;
    const cache = await caches.open(names[0]);
    for (const [name, digest] of Object.entries(expected)) {
      const res = await cache.match(`/haidao/${name}`);
      if (!res) return false;
      const bytes = await res.arrayBuffer();
      const actual = [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))]
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      if (actual !== digest) return false;
    }
    return Object.keys(expected).length;
  }, expected);
}
async function save(page, id, filename) {
  const event = page.waitForEvent("download");
  await page.locator(id).click();
  const d = await event;
  assert.equal(await d.failure(), null);
  await d.saveAs(path.join(out, filename));
  const bytes = await readFile(path.join(out, filename));
  return { filename, bytes: bytes.length, sha256: sha(bytes) };
}
const results = [];
try {
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const proxy = { server: `http://127.0.0.1:${server.address().port}` };
  for (const [engine, launcher] of [
    ["chromium", chromium],
    ["firefox", firefox],
  ]) {
    const browser = await launcher.launch({ proxy });
    try {
      for (const width of [1440, 375]) {
        blocked = false;
        const context = await browser.newContext({
          viewport: { width, height: 1000 },
          acceptDownloads: true,
        });
        try {
          const page = await context.newPage(),
            errors = [];
          page.on("pageerror", (e) => errors.push(e.message));
          const beforeBytes = forwarded;
          const initial = await page.goto(
            `${base}?error=2&probe=37&rearProbe=-61&read=6&page=11&step=6#uncertainty`,
          );
          assert.ok((await initial.body()).equals(files.get("index.html")));
          await ready(page);
          assert.equal(await inventory(page), Object.keys(expected).length);
          assert.ok(forwarded > beforeBytes);
          const probe = `${base}__transport_probe`;
          assert.equal(
            await page.evaluate(
              async (url) => (await fetch(url, { cache: "no-store" })).status,
              probe,
            ),
            404,
          );
          const beforeRefused = refused;
          disconnect();
          const failure = await page.evaluate(async (url) => {
            try {
              await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(8000) });
              return null;
            } catch (e) {
              return e.name;
            }
          }, probe);
          assert.ok(failure);
          assert.ok(refused > beforeRefused);
          assert.equal(await page.evaluate(() => navigator.onLine), true);
          await page.reload();
          await ready(page);
          assert.equal(await page.locator("#error-probe").inputValue(), "37");
          assert.equal(await page.locator("#rear-error-probe").inputValue(), "-61");
          for (const source of [9, 10, 11, 12, 13]) {
            await page.locator("#source-page").selectOption(String(source));
            await page.waitForFunction(
              (p) =>
                document
                  .querySelector("#source-status")
                  .textContent.startsWith(`Opening ${p} · complete`),
              source,
            );
          }
          await page.locator("#source-zoom").click();
          const image = page.locator("#source-frame img");
          assert.equal(await image.evaluate((i) => i.getBoundingClientRect().width), 3600);
          await page.locator("#source-frame").focus();
          const beforePan = await page.locator("#source-frame").evaluate((e) => e.scrollLeft);
          await page.keyboard.press("ArrowRight");
          await page.waitForTimeout(200);
          assert.ok(
            (await page.locator("#source-frame").evaluate((e) => e.scrollLeft)) > beforePan,
          );
          await page.locator("#error-probe").focus();
          await page.keyboard.press("ArrowRight");
          await page.locator("#rear-error-probe").focus();
          await page.keyboard.press("ArrowRight");
          assert.equal(await page.locator("#error-probe").inputValue(), "38");
          assert.equal(await page.locator("#rear-error-probe").inputValue(), "-60");
          await page.locator("#equal-errors").click();
          assert.match(await page.locator("#bounds").textContent(), /No finite upper bound/);
          await page.locator("#error-mode").selectOption("shared");
          assert.match(
            await page.locator("#error-witness").textContent(),
            /H = 1255 bu; D = 30940 bu/,
          );
          const csv = await save(page, "#save-csv", `${engine}-${width}.csv`);
          const html = await save(page, "#save-html", `${engine}-${width}.html`);
          const portableContext = await browser.newContext({
            javaScriptEnabled: false,
            viewport: { width, height: 1000 },
          });
          const portable = await portableContext.newPage(),
            external = [];
          portable.on("request", (req) => {
            if (/^https?:/.test(req.url())) external.push(req.url());
          });
          await portable.goto(pathToFileURL(path.join(out, html.filename)).href);
          await portable.evaluate(() => document.fonts.ready);
          assert.equal(await portable.locator("script").count(), 0);
          assert.match(
            await portable.locator(".witness-result").textContent(),
            /H = 1255 bu; D = 30940 bu/,
          );
          const layout = await portable.evaluate(() => ({
            images: [...document.images].map((i) => ({
              complete: i.complete,
              width: i.naturalWidth,
            })),
            fonts: [...document.fonts].map((f) => f.status),
            width: document.documentElement.scrollWidth,
          }));
          assert.equal(layout.images.length, 5);
          assert.ok(layout.images.every((i) => i.complete && i.width === 3600));
          assert.ok(layout.fonts.every((s) => s === "loaded"));
          assert.equal(layout.width, width);
          assert.deepEqual(external, []);
          await portableContext.close();
          assert.equal(await inventory(page), Object.keys(expected).length);
          assert.deepEqual(errors, []);
          blocked = false;
          for (const name of ["", "index.html"]) {
            const response = await fetch(new URL(name, base), {
              signal: AbortSignal.timeout(20000),
            });
            assert.equal(response.status, 200);
            assert.ok(Buffer.from(await response.arrayBuffer()).equals(files.get("index.html")));
          }
          results.push({
            engine,
            width,
            edition,
            verifiedCachedFiles: Object.keys(expected).length,
            actualTunnelCut: true,
            browserNetworkingEnabled: true,
            probeFailure: failure,
            refusedTunnels: refused - beforeRefused,
            csv,
            html,
            portable: layout,
            canonicalDirectoryAndIndexRechecked: true,
            errors,
          });
          console.log(
            `${engine}-${width}: verified HTTPS edition, actual transport refusal, all sources, both controls, native portable files and canonical recheck passed`,
          );
        } finally {
          await context.close();
        }
      }
    } finally {
      await browser.close();
    }
  }
  await writeFile(path.join(out, "report.json"), `${JSON.stringify({ base, results }, null, 2)}\n`);
} finally {
  disconnect();
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
}
