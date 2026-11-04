import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, firefox } from "playwright";
import { auditServer } from "./audit-server.mjs";

const out = path.resolve(process.argv[2] ?? "/tmp/haidao-cold-transfer");
await mkdir(out, { recursive: true });
const origin = await auditServer();
origin.throttle(128000);
const results = [];
try {
  for (const [engine, launcher] of [
    ["chromium", chromium],
    ["firefox", firefox],
  ]) {
    const browser = await launcher.launch();
    const context = await browser.newContext({ viewport: { width: 375, height: 950 } });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const start = Date.now();
    await page.goto(origin.base, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(
      () =>
        document.querySelector("#source-status").textContent.startsWith("Opening 10 · complete"),
      null,
      { timeout: 65000 },
    );
    const firstReadMs = Date.now() - start;
    const readStart = Date.now();
    await page.locator("#source-page").selectOption("11");
    await page.waitForFunction(
      () =>
        document.querySelector("#source-status").textContent.startsWith("Opening 11 · complete"),
      null,
      { timeout: 65000 },
    );
    const secondReadMs = Date.now() - readStart;
    await page.waitForFunction(
      () =>
        document
          .querySelector("#offline-status")
          .textContent.includes("Ready for an offline reload"),
      null,
      { timeout: 65000 },
    );
    const installMs = Date.now() - start;
    assert.ok(
      firstReadMs > 15000,
      `First source did not exercise a transfer longer than the former deadline: ${firstReadMs}`,
    );
    assert.ok(installMs > 30000);
    await page
      .locator("#reading")
      .screenshot({ path: path.join(out, `${engine}-cold-source.png`) });
    origin.disconnect();
    await page.reload();
    await page.waitForFunction(() => document.querySelector("#source-frame img")?.complete);
    assert.equal(await page.locator("#source-page").inputValue(), "11");
    assert.equal(await page.evaluate(() => navigator.onLine), true);
    origin.reconnect();
    assert.deepEqual(errors, []);
    results.push({
      engine,
      sharedBytesPerSecond: 128000,
      firstReadMs,
      secondReadMs,
      installMs,
      actualConnectionOutage: true,
      errors,
    });
    console.log(
      `${engine}: cold source ${firstReadMs} ms; second source ${secondReadMs} ms; complete install ${installMs} ms; actual outage reload passed`,
    );
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
