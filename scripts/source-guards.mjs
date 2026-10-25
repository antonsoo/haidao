import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import { chromium, firefox } from "playwright";

const root = path.resolve("dist");
const out = process.argv[2] ?? path.join(tmpdir(), "haidao-source-guards.json");
let mode = "normal";
let held = [];
const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".jpg": "image/jpeg",
  ".ttf": "font/ttf",
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
  ".txt": "text/plain",
};
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    let name = decodeURIComponent(url.pathname.replace(/^\/haidao\//, "")) || "index.html";
    if (name.includes("..") || name.startsWith("/")) {
      res.writeHead(400).end();
      return;
    }
    if (name === "sources/waseda-11.jpg" && mode === "held")
      await new Promise((resolve) => held.push(resolve));
    if (name === "sources/waseda-11.jpg" && mode === "wrong") name = "sources/waseda-12.jpg";
    const bytes = await readFile(path.join(root, name));
    res.writeHead(200, {
      "content-type": mime[path.extname(name)] ?? "application/octet-stream",
      "cache-control": "no-store",
    });
    res.end(bytes);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const base = `http://127.0.0.1:${server.address().port}/haidao/`;
const results = [];
try {
  for (const [engine, launcher] of [
    ["chromium", chromium],
    ["firefox", firefox],
  ]) {
    const browser = await launcher.launch();
    // No worker can mask the online wrong bytes by returning a correct cached photograph.
    mode = "wrong";
    const context = await browser.newContext({ serviceWorkers: "block" });
    const page = await context.newPage();
    let downloads = 0;
    page.on("download", () => downloads++);
    await page.goto(`${base}?page=11`);
    await page.waitForFunction(() =>
      document.querySelector("#source-status").textContent.includes("identity check failed"),
    );
    assert.equal(await page.locator("#source-frame img").count(), 0);
    await page.locator("#save-html").click();
    await page.waitForFunction(() =>
      document.querySelector("#save-status").textContent.startsWith("Nothing was downloaded."),
    );
    assert.equal(downloads, 0);
    // Release a late photograph after the reader has already chosen a different opening.
    mode = "held";
    await page.locator("#source-page").selectOption("10");
    await page.waitForFunction(() =>
      document.querySelector("#source-status").textContent.includes("identity checked"),
    );
    await page.locator("#source-page").selectOption("11");
    await page.waitForFunction(() =>
      document.querySelector("#source-status").textContent.includes("Loading"),
    );
    await page.locator("#source-page").selectOption("12");
    await page.waitForFunction(() =>
      document.querySelector("#source-status").textContent.startsWith("Opening 12 · complete"),
    );
    mode = "normal";
    for (const release of held) release();
    held = [];
    await page.waitForTimeout(300);
    assert.equal(await page.locator("#source-page").inputValue(), "12");
    assert.match(await page.locator("#source-frame img").getAttribute("alt"), /opening 12/);
    await context.close();
    mode = "held";
    const offlineContext = await browser.newContext();
    const offlinePage = await offlineContext.newPage();
    await offlinePage.goto(base);
    await offlinePage.waitForFunction(() => document.querySelector("#source-frame img")?.complete);
    await offlinePage.waitForTimeout(300);
    await offlinePage.locator("#offline-check").click();
    assert.ok(
      !(await offlinePage.locator("#offline-status").innerText()).includes(
        "Ready for an offline reload",
      ),
    );
    const heldStatus = await offlinePage.locator("#offline-status").innerText();
    mode = "normal";
    for (const release of held) release();
    held = [];
    await offlinePage.waitForFunction(() =>
      document.querySelector("#offline-status").textContent.includes("Ready for an offline reload"),
    );
    const ready = await offlinePage.locator("#offline-status").innerText();
    // Inventory must reveal deletion without recreating a cache during inspection.
    const removed = await offlinePage.evaluate(async () => {
      const names = await caches.keys();
      for (const name of names) if (name.startsWith("haidao-")) await caches.delete(name);
      return names;
    });
    await offlinePage.locator("#offline-check").click();
    await offlinePage.waitForFunction(() =>
      document.querySelector("#offline-status").textContent.includes("incomplete"),
    );
    const afterInspection = await offlinePage.evaluate(() => caches.keys());
    assert.deepEqual(afterInspection, []);
    await offlinePage.locator("#offline-check").click();
    await offlinePage.waitForFunction(() =>
      document.querySelector("#offline-status").textContent.includes("Ready for an offline reload"),
    );
    await offlineContext.setOffline(true);
    await offlinePage.reload();
    await offlinePage.waitForFunction(() => document.querySelector("#source-frame img")?.complete);
    await offlineContext.setOffline(false);
    results.push({
      cacheRebuildAndOfflineReload: true,
      engine,
      wrongPhotographRefused: true,
      completeDownloadRefused: true,
      lateResponseRetainsOpening12: true,
      heldSourceDoesNotClaimReady: heldStatus,
      completeEdition: ready,
      deletedCaches: removed,
      inspectionCreatedNoCaches: afterInspection,
    });
    await offlineContext.close();
    await browser.close();
  }
  await writeFile(out, `${JSON.stringify({ results }, null, 2)}\n`);
  console.log(JSON.stringify({ engines: results.length, passed: true }));
} finally {
  mode = "normal";
  for (const release of held) release();
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
}
