import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, firefox } from "playwright";
import { auditServer } from "./audit-server.mjs";

const before = process.argv[2];
if (!before) throw new Error("Pass the separately built previous dist directory.");
const out = path.resolve(process.argv[3] ?? "/tmp/haidao-upgrade-audit");
await mkdir(out, { recursive: true });
const current = path.resolve("dist");
const next = process.argv[4] ? path.resolve(process.argv[4]) : null;
const nextEdition = next
  ? (await readFile(path.join(next, "sw.js"), "utf8")).match(/const EDITION = "([a-f0-9]+)"/)[1]
  : null;
const edition = (await readFile(path.join(current, "sw.js"), "utf8")).match(
  /const EDITION = "([a-f0-9]+)"/,
)[1];
const origin = await auditServer(before);
const results = [];
try {
  for (const [engine, launcher] of [
    ["chromium", chromium],
    ["firefox", firefox],
  ]) {
    const browser = await launcher.launch();
    const context = await browser.newContext({ viewport: { width: 375, height: 950 } });
    const old = await context.newPage(),
      second = await context.newPage();
    for (const p of [old, second]) {
      await p.goto(`${origin.base}?error=2&errorMode=shared&probe=100`);
      await p.waitForFunction(() =>
        document
          .querySelector("#offline-status")
          .textContent.includes("Ready for an offline reload"),
      );
    }
    const oldStatus = await old.locator("#offline-status").textContent();
    assert.ok(!oldStatus.includes(edition));
    origin.root(current);
    origin.fault({ name: "sources/waseda-11.jpg", mode: "wrong" });
    await old.evaluate(async () => {
      window.failedUpgrade = false;
      const registration = await navigator.serviceWorker.getRegistration();
      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        worker.addEventListener("statechange", () => {
          if (worker.state === "redundant") window.failedUpgrade = true;
        });
      });
      await registration.update();
    });
    await old.waitForFunction(() => window.failedUpgrade);
    const cacheNamesAfterFailure = await old.evaluate(() => caches.keys());
    assert.ok(cacheNamesAfterFailure.some((n) => oldStatus.includes(n.replace("haidao-", ""))));
    // A failed new install leaves the complete old worker and source usable.
    origin.disconnect();
    await old.locator("#source-page").selectOption("11");
    await old.waitForFunction(() =>
      document.querySelector("#source-status").textContent.startsWith("Opening 11 · complete"),
    );
    origin.reconnect();
    origin.fault(null);
    await old.evaluate(async () => {
      const r = await navigator.serviceWorker.getRegistration();
      await r.update();
    });
    for (const p of [old, second])
      await p.waitForFunction(() =>
        document.querySelector("#offline-status").textContent.includes("different editions"),
      );
    const oldPagesWithdrawReady = await Promise.all(
      [old, second].map((p) => p.locator("#offline-status").textContent()),
    );
    const page = await context.newPage();
    await page.goto(`${origin.base}?error=2&errorMode=shared&probe=100`);
    await page.waitForFunction(
      (edition) =>
        document.querySelector("#offline-status").textContent.includes(edition) &&
        document
          .querySelector("#offline-status")
          .textContent.includes("Ready for an offline reload"),
      edition,
    );
    assert.equal(await page.locator("#error-mode").inputValue(), "shared");
    assert.equal(await page.locator("#error-probe").inputValue(), "100");
    const names = await page.evaluate(() => caches.keys());
    assert.deepEqual(names, [`haidao-${edition}`]);
    origin.disconnect();
    await page.reload();
    await page.waitForFunction(() => document.querySelector("#source-frame img")?.complete);
    assert.match(await page.locator("#error-witness").textContent(), /H = 1255 bu; D = 31250 bu/);
    assert.equal(await page.evaluate(() => navigator.onLine), true);
    origin.reconnect();
    results.push({
      engine,
      oldStatus,
      failedUpgradeKeptOldCache: cacheNamesAfterFailure,
      oldPagesWithdrawReady,
      currentEdition: edition,
      finalCaches: names,
      actualOutageReload: true,
    });
    console.log(
      `${engine}: failed upgrade preserves old edition; successful upgrade withdraws old readiness and retains state offline`,
    );
    await context.close();
    if (next) {
      origin.root(current);
      const newerContext = await browser.newContext({ viewport: { width: 375, height: 950 } });
      const newer = await newerContext.newPage();
      await newer.goto(`${origin.base}?error=2&probe=37&rearProbe=-61&errorMode=independent`);
      await newer.waitForFunction(
        (edition) =>
          document.querySelector("#offline-status").textContent.includes(edition) &&
          document
            .querySelector("#offline-status")
            .textContent.includes("Ready for an offline reload"),
        edition,
      );
      origin.root(next);
      await newer.evaluate(async () => {
        const r = await navigator.serviceWorker.getRegistration();
        await r.update();
      });
      await newer.waitForFunction(() =>
        document.querySelector("#offline-status").textContent.includes("different editions"),
      );
      assert.equal(await newer.locator("#offline-check").textContent(), "Reload current edition");
      await newer.locator("#offline-check").click();
      await newer.waitForFunction(
        (edition) =>
          document.querySelector("#offline-status").textContent.includes(edition) &&
          document
            .querySelector("#offline-status")
            .textContent.includes("Ready for an offline reload"),
        nextEdition,
      );
      assert.equal(await newer.locator("#error-probe").inputValue(), "37");
      assert.equal(await newer.locator("#rear-error-probe").inputValue(), "-61");
      origin.disconnect();
      await newer.reload();
      await newer.waitForFunction(() => document.querySelector("#source-frame img")?.complete);
      assert.equal(await newer.locator("#rear-error-probe").inputValue(), "-61");
      assert.equal(await newer.evaluate(() => navigator.onLine), true);
      origin.reconnect();
      results.at(-1).currentClientReload = {
        from: edition,
        to: nextEdition,
        directReloadAction: true,
        frontProbe: 37,
        rearProbe: -61,
        actualOutageReload: true,
      };
      await newerContext.close();
      console.log(
        `${engine}: current-client reload action retains both probe values through another actual built edition`,
      );
    }
    await browser.close();
    origin.root(before);
  }
  await writeFile(
    path.join(out, "report.json"),
    `${JSON.stringify({ results, requests: origin.requests }, null, 2)}\n`,
  );
} finally {
  origin.reconnect();
  await origin.close();
}
