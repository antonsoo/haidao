import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, firefox } from "playwright";
import { auditServer } from "./audit-server.mjs";

const out = path.resolve(process.argv[2] ?? "/tmp/haidao-transfers");
await mkdir(out, { recursive: true });
const origin = await auditServer();
const results = [];
try {
  for (const [engine, launcher] of [
    ["chromium", chromium],
    ["firefox", firefox],
  ]) {
    const browser = await launcher.launch();
    const context = await browser.newContext({
      serviceWorkers: "block",
      acceptDownloads: true,
      viewport: { width: 375, height: 950 },
    });
    const page = await context.newPage();
    const errors = [],
      downloads = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("download", (d) => downloads.push(d));
    await page.goto(`${origin.base}?error=2&errorMode=shared&probe=100`);
    await page.waitForFunction(() => document.querySelector("#source-frame img")?.complete);
    origin.fault({ name: "sources/waseda-11.jpg", mode: "slow", interval: 300 });
    const start = Date.now();
    await page.locator("#source-page").selectOption("11");
    await page.waitForFunction(() =>
      document.querySelector("#source-status").textContent.includes("KiB received"),
    );
    await page.locator("#save-html").click();
    await page.waitForFunction(() =>
      document.querySelector("#save-status").textContent.includes("KiB received"),
    );
    await page.locator("#error-probe").focus();
    await page.keyboard.press("ArrowLeft");
    await page.locator("#save-cancel").click();
    assert.match(await page.locator("#save-status").textContent(), /Saving cancelled/);
    assert.equal(await page.locator("#error-probe").inputValue(), "99");
    assert.equal(await page.locator("#save-html").isEnabled(), true);
    await page.locator("#save").screenshot({ path: path.join(out, `${engine}-cancel.png`) });
    await page.waitForFunction(
      () =>
        document.querySelector("#source-status").textContent.startsWith("Opening 11 · complete"),
      null,
      { timeout: 30000 },
    );
    const slowReadMs = Date.now() - start;
    assert.ok(slowReadMs > 15000);
    assert.equal(downloads.length, 0);
    assert.doesNotMatch(
      await page.locator("#offline-status").textContent(),
      /undefined|addEventListener|TypeError/,
    );
    await page.locator("#error-probe").focus();
    await page.keyboard.press("ArrowRight");
    const saveStart = Date.now();
    const event = page.waitForEvent("download", { timeout: 35000 });
    await page.locator("#save-html").click();
    await page.waitForFunction(() =>
      document.querySelector("#save-status").textContent.includes("KiB received"),
    );
    await page.locator("#error-mode").selectOption("independent");
    const download = await event;
    const saved = path.join(out, `${engine}-slow-reading.html`);
    await download.saveAs(saved);
    const slowSaveMs = Date.now() - saveStart;
    assert.ok(slowSaveMs > 15000);
    assert.equal(await page.locator("#error-mode").inputValue(), "independent");
    assert.equal(
      await page.locator("#error-witness .witness-result").getAttribute("data-kind"),
      "parallel",
    );
    const html = await readFile(saved, "utf8");
    assert.match(html, /H = 1255 bu; D = 31250 bu/);
    assert.ok(html.includes("&quot;error_model&quot;,&quot;shared&quot;"));
    const fileContext = await browser.newContext({
      javaScriptEnabled: false,
      offline: true,
      viewport: { width: 375, height: 950 },
    });
    const portable = await fileContext.newPage();
    await portable.goto(`file://${saved}`);
    assert.equal(await portable.locator("script").count(), 0);
    assert.match(
      await portable.locator(".witness-result").textContent(),
      /H = 1255 bu; D = 31250 bu/,
    );
    await fileContext.close();
    const faults = [];
    for (const mode of ["headers", "body", "wrong", "short", "long"]) {
      origin.fault(null);
      await page.locator("#source-page").selectOption("10");
      await page.waitForFunction(() =>
        document.querySelector("#source-status").textContent.startsWith("Opening 10 · complete"),
      );
      origin.fault({ name: "sources/waseda-11.jpg", mode });
      const faultStart = Date.now();
      await page.locator("#source-page").selectOption("11");
      await page.waitForFunction(
        () => document.querySelector("#source-status").textContent.includes("Opening unavailable"),
        null,
        { timeout: 22000 },
      );
      const status = await page.locator("#source-status").textContent();
      assert.equal(await page.locator("#source-frame img").count(), 0);
      assert.equal(await page.locator("#source-retry").isVisible(), true);
      if (mode === "headers" || mode === "body")
        assert.match(status, /No data arrived for 15 seconds/);
      else assert.match(status, /identity check failed/);
      if (mode === "body")
        await page
          .locator("#reading")
          .screenshot({ path: path.join(out, `${engine}-stalled.png`) });
      faults.push({ mode, elapsedMs: Date.now() - faultStart, status });
      origin.fault(null);
      origin.release();
      await page.locator("#source-retry").click();
      await page.waitForFunction(() =>
        document.querySelector("#source-status").textContent.startsWith("Opening 11 · complete"),
      );
      assert.equal(await page.locator("#source-retry").isVisible(), false);
    }
    assert.deepEqual(errors, []);
    results.push({
      engine,
      slowReadMs,
      slowSaveMs,
      cancelledWithoutDownload: true,
      snapshotPreserved: true,
      retryWithoutChangingOpening: true,
      faults,
      errors,
    });
    console.log(
      `${engine}: healthy slow source/export, cancellation, saved snapshot, header/body stalls and invalid bytes passed`,
    );
    await context.close();
    await browser.close();
  }
  await writeFile(
    path.join(out, "report.json"),
    `${JSON.stringify({ results, requests: origin.requests }, null, 2)}\n`,
  );
} finally {
  await origin.close();
}
