import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, firefox } from "playwright";
import { auditServer } from "./audit-server.mjs";

const out = path.resolve(process.argv[2] ?? "/tmp/haidao-offline-audit");
await mkdir(out, { recursive: true });
const origin = await auditServer();
const results = [];
async function ready(page, timeout = 30000) {
  await page.waitForFunction(
    () =>
      document.querySelector("#offline-status").textContent.includes("Ready for an offline reload"),
    null,
    { timeout },
  );
}
async function incomplete(page) {
  await page.waitForFunction(() =>
    document.querySelector("#offline-status").textContent.includes("incomplete"),
  );
}
async function remove(page, all) {
  return page.evaluate(async (all) => {
    const names = (await caches.keys()).filter((n) => n.startsWith("haidao-"));
    for (const name of names) {
      if (all) await caches.delete(name);
      else {
        const c = await caches.open(name);
        await c.delete(new URL("sources/waseda-11.jpg", location.href));
      }
    }
    return names;
  }, all);
}
async function inventory(page) {
  return page.evaluate(async () => {
    const result = [];
    for (const n of await caches.keys()) {
      const cache = await caches.open(n);
      for (const req of await cache.keys()) {
        const response = await cache.match(req);
        const data = await response.arrayBuffer();
        const sha256 = [...new Uint8Array(await crypto.subtle.digest("SHA-256", data))]
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
        result.push({ path: new URL(req.url).pathname, bytes: data.byteLength, sha256 });
      }
    }
    return result.sort((a, b) => a.path.localeCompare(b.path));
  });
}
try {
  for (const [engine, launcher] of [
    ["chromium", chromium],
    ["firefox", firefox],
  ]) {
    const browser = await launcher.launch();
    const context = await browser.newContext({
      viewport: { width: 375, height: 950 },
      acceptDownloads: true,
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    origin.fault({ name: "sources/waseda-11.jpg", mode: "status" });
    await page.goto(`${origin.base}?error=2&errorMode=shared&probe=100`);
    await page.waitForFunction(() =>
      document.querySelector("#offline-status").textContent.includes("could not be installed"),
    );
    assert.equal(await page.evaluate(() => navigator.serviceWorker.controller), null);
    const failedInstall = await page.locator("#offline-status").textContent();
    origin.fault(null);
    await page.locator("#offline-check").click();
    await ready(page);
    assert.equal(await page.locator("#error-mode").inputValue(), "shared");
    const page2 = await context.newPage();
    page2.on("pageerror", (e) => errors.push(e.message));
    await page2.goto(`${origin.base}?error=2&errorMode=independent&probe=99`);
    await ready(page2);
    const full = await inventory(page);
    await remove(page, true);
    await page.locator("#offline-check").click();
    await incomplete(page);
    await incomplete(page2);
    const invalidated = await page2.locator("#offline-status").textContent();
    origin.fault({ name: "sources/waseda-11.jpg", mode: "slow", interval: 800 });
    const repairStart = Date.now();
    await page.locator("#offline-check").click();
    await page.waitForFunction(() =>
      document.querySelector("#offline-status").textContent.includes("KiB received"),
    );
    await page.waitForTimeout(46000);
    assert.equal(await page.locator("#offline-check").isDisabled(), true);
    assert.doesNotMatch(
      await page.locator("#offline-status").textContent(),
      /timed out|Ready for an offline reload/,
    );
    await ready(page, 25000);
    await ready(page2);
    const slowRepairMs = Date.now() - repairStart;
    assert.ok(slowRepairMs > 45000);
    assert.deepEqual(await inventory(page), full);
    console.log(
      `${engine}: initial-install retry, cross-tab invalidation and repair beyond 45 seconds passed`,
    );
    origin.fault(null);
    await remove(page, false);
    await page.locator("#offline-check").click();
    await incomplete(page);
    await incomplete(page2);
    const partial = await inventory(page);
    assert.equal(partial.length, full.length - 1);
    origin.fault({ name: "sources/waseda-11.jpg", mode: "body" });
    await page.locator("#offline-check").click();
    await page.waitForFunction(
      () =>
        document
          .querySelector("#offline-status")
          .textContent.includes("No data arrived for 15 seconds"),
      null,
      { timeout: 25000 },
    );
    assert.equal(await page.locator("#offline-check").isEnabled(), true);
    assert.deepEqual(await inventory(page), partial);
    const failedRepair = await page.locator("#offline-status").textContent();
    origin.fault(null);
    origin.release();
    await page.locator("#offline-check").click();
    await ready(page);
    await ready(page2);
    assert.deepEqual(await inventory(page), full);
    // Corrupt an already installed source, then substitute its network replacement too.
    await page2.locator("#source-page").selectOption("10");
    await page2.waitForFunction(() =>
      document.querySelector("#source-status").textContent.includes("identity checked"),
    );
    await page.evaluate(async () => {
      const names = await caches.keys();
      const c = await caches.open(names.find((n) => n.startsWith("haidao-")));
      const wrong = await c.match(new URL("sources/waseda-12.jpg", location.href));
      await c.put(new URL("sources/waseda-11.jpg", location.href), wrong);
    });
    origin.fault({ name: "sources/waseda-11.jpg", mode: "wrong" });
    await page2.locator("#source-page").selectOption("11");
    await page2.waitForFunction(() =>
      document.querySelector("#source-status").textContent.includes("Opening unavailable"),
    );
    assert.equal(await page2.locator("#source-frame img").count(), 0);
    await incomplete(page);
    await incomplete(page2);
    let downloadCount = 0;
    page2.on("download", () => downloadCount++);
    await page2.locator("#save-html").click();
    await page2.waitForFunction(() =>
      document.querySelector("#save-status").textContent.startsWith("Nothing was downloaded"),
    );
    assert.equal(downloadCount, 0);
    origin.fault(null);
    await page2.locator("#source-retry").click();
    await page2.waitForFunction(() =>
      document.querySelector("#source-status").textContent.startsWith("Opening 11 · complete"),
    );
    await page.locator("#offline-check").click();
    await ready(page);
    await ready(page2);
    const mismatchRequests = origin.requests.length;
    const mismatch = await page.evaluate(async () => {
      const channel = new MessageChannel();
      const reply = new Promise((resolve) => {
        channel.port1.onmessage = (event) => {
          channel.port1.close();
          resolve(event.data);
        };
      });
      navigator.serviceWorker.controller.postMessage({ type: "repair", edition: "older-page" }, [
        channel.port2,
      ]);
      return reply;
    });
    assert.equal(mismatch.repaired, false);
    assert.match(mismatch.error, /page and offline controller differ/);
    assert.equal(origin.requests.length, mismatchRequests);
    // Stop real connections while browser networking remains enabled.
    origin.disconnect();
    for (const p of [page, page2]) {
      await p.reload();
      await p.waitForFunction(() => document.querySelector("#source-frame img")?.complete);
      await ready(p);
      assert.equal(await p.evaluate(() => navigator.onLine), true);
      await p.locator("#error-mode").selectOption("shared");
      assert.match(await p.locator("#error-witness").textContent(), /H = 1255/);
      const event = p.waitForEvent("download");
      await p.locator("#save-html").click();
      const d = await event;
      const saved = path.join(out, `${engine}-outage-${p === page ? "first" : "second"}.html`);
      await d.saveAs(saved);
      if (p === page2)
        await p.locator("#save").screenshot({ path: path.join(out, `${engine}-outage.png`) });
    }
    origin.reconnect();
    assert.deepEqual(errors, []);
    results.push({
      engine,
      failedInstall,
      invalidated,
      slowRepairMs,
      failedRepair,
      verifiedFilesRetainedOnFailure: partial.length,
      totalFiles: full.length,
      mismatch,
      actualConnectionOutage: true,
      browserNetworkingEnabled: true,
      errors,
      inventorySha256: createHash("sha256").update(JSON.stringify(full)).digest("hex"),
    });
    await context.close();
    await browser.close();
  }
  await writeFile(
    path.join(out, "report.json"),
    `${JSON.stringify({ results, requests: origin.requests }, null, 2)}\n`,
  );
} finally {
  origin.reconnect();
  await origin.close();
}
