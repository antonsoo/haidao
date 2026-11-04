import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, firefox } from "playwright";
import { auditServer } from "./audit-server.mjs";

const root = process.argv[2];
if (!root) throw new Error("Pass the separately built fc55571 dist directory.");
const out = path.resolve(process.argv[3] ?? "/tmp/haidao-audit-before");
await mkdir(out, { recursive: true });
const origin = await auditServer(root);
const results = [];
try {
  for (const [engine, launcher] of [
    ["chromium", chromium],
    ["firefox", firefox],
  ]) {
    const browser = await launcher.launch();
    const context = await browser.newContext({ serviceWorkers: "block" });
    const page = await context.newPage();
    await page.goto(origin.base);
    await page.waitForFunction(() => document.querySelector("#source-frame img")?.complete);
    origin.fault({ name: "sources/waseda-11.jpg", mode: "slow", interval: 300 });
    const start = Date.now();
    await page.locator("#source-page").selectOption("11");
    await page.waitForFunction(
      () => document.querySelector("#source-status").textContent.includes("Opening unavailable"),
      null,
      { timeout: 23000 },
    );
    const slowSource = {
      elapsedMs: Date.now() - start,
      status: await page.locator("#source-status").textContent(),
      images: await page.locator("#source-frame img").count(),
    };
    assert.equal(slowSource.images, 0);
    origin.fault(null);
    await context.close();
    const tabs = await browser.newContext();
    const first = await tabs.newPage();
    const second = await tabs.newPage();
    for (const p of [first, second]) {
      await p.goto(origin.base);
      await p.waitForFunction(() =>
        document
          .querySelector("#offline-status")
          .textContent.includes("Ready for an offline reload"),
      );
    }
    await first.evaluate(async () => {
      for (const name of await caches.keys()) await caches.delete(name);
    });
    await first.locator("#offline-check").click();
    await first.waitForFunction(() =>
      document.querySelector("#offline-status").textContent.includes("incomplete"),
    );
    await second.bringToFront();
    await second.waitForTimeout(500);
    const staleOtherTab = await second.locator("#offline-status").textContent();
    assert.match(staleOtherTab, /Ready for an offline reload/);
    await tabs.close();
    origin.fault({ name: "sources/waseda-11.jpg", mode: "status" });
    const cold = await browser.newContext();
    const p = await cold.newPage();
    const mark = origin.requests.length;
    await p.goto(origin.base);
    await p.waitForFunction(() => document.querySelector("#source-frame img")?.complete);
    for (let i = 0; i < 50 && !origin.requests.slice(mark).some((r) => r.mode === "status"); i++)
      await p.waitForTimeout(100);
    assert.ok(origin.requests.slice(mark).some((r) => r.mode === "status"));
    await p.waitForFunction(async () => {
      const r = await navigator.serviceWorker.getRegistration();
      return !r?.installing && !navigator.serviceWorker.controller;
    });
    origin.fault(null);
    const requestsBeforeRetry = origin.requests.length;
    await p.locator("#offline-check").click();
    await p.waitForTimeout(700);
    const failedInitialRetry = {
      controller: await p.evaluate(() => Boolean(navigator.serviceWorker.controller)),
      addedRequests: origin.requests.length - requestsBeforeRetry,
      status: await p.locator("#offline-status").textContent(),
    };
    assert.equal(failedInitialRetry.controller, false);
    assert.equal(failedInitialRetry.addedRequests, 0);
    results.push({ engine, slowSource, staleOtherTab, failedInitialRetry });
    await cold.close();
    await browser.close();
    console.log(
      `${engine}: reproduced healthy transfer refusal, stale other-tab readiness, and ineffective first-install retry`,
    );
  }
  await writeFile(
    path.join(out, "report.json"),
    `${JSON.stringify({ source: "fc55571", results }, null, 2)}\n`,
  );
} finally {
  origin.fault(null);
  await origin.close();
}
