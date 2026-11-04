import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, firefox } from "playwright";
import { auditServer } from "./audit-server.mjs";

const out = path.resolve(process.argv[2] ?? "/tmp/haidao-fragments");
const publicBase = process.argv[3];
await mkdir(out, { recursive: true });
const origin = publicBase ? null : await auditServer();
const base = publicBase ?? origin.base;
const results = [];
async function position(page, id) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
  return page.evaluate((id) => {
    const rect = document.getElementById(id).getBoundingClientRect();
    const padding = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
    return {
      actual: scrollY,
      expected: Math.min(
        scrollY + rect.top - padding,
        document.scrollingElement.scrollHeight - innerHeight,
      ),
      top: rect.top,
      bottom: rect.bottom,
      width: document.documentElement.scrollWidth,
      viewport: innerWidth,
    };
  }, id);
}
try {
  for (const [engine, launcher] of [
    ["chromium", chromium],
    ["firefox", firefox],
  ]) {
    const browser = await launcher.launch();
    for (const width of [1440, 375])
      for (const motion of ["no-preference", "reduce"]) {
        const context = await browser.newContext({
          viewport: { width, height: 1000 },
          reducedMotion: motion,
        });
        for (const section of ["survey", "reading", "uncertainty", "save"]) {
          const page = await context.newPage();
          const errors = [];
          page.on("pageerror", (e) => errors.push(e.message));
          await page.goto(`${base}?error=2&probe=37&rearProbe=-61#${section}`);
          await page.waitForFunction(() => document.querySelector("#rear-error-probe"));
          const initial = await position(page, section);
          // Late source-status wrapping may move the heading by one or two lines.
          // Require an actual section landing, not identical subpixel scroll offsets.
          assert.ok(
            Math.abs(initial.actual - initial.expected) < 80,
            JSON.stringify({ engine, width, motion, section, initial }),
          );
          assert.equal(initial.width, width);
          assert.equal(await page.locator("#rear-error-probe").inputValue(), "-61");
          let history;
          if (section === "uncertainty") {
            const link = page.locator('header a[href="#reading"]');
            await link.scrollIntoViewIfNeeded();
            const beforeNavigation = await page.evaluate(() => scrollY);
            await link.click();
            const reading = await position(page, "reading");
            assert.ok(Math.abs(reading.actual - reading.expected) < 80);
            await page.goBack();
            history = await position(page, "uncertainty");
            // Engines differ on fragment-history restoration: last viewport or
            // the fragment itself. Preserve the browser's native policy.
            assert.ok(
              Math.abs(history.actual - beforeNavigation) < 3 ||
                Math.abs(history.actual - history.expected) < 80,
              JSON.stringify({ engine, width, motion, history, beforeNavigation }),
            );
            history.beforeNavigation = beforeNavigation;
            assert.equal(new URL(page.url()).searchParams.get("rearProbe"), "-61");
            await page.screenshot({ path: path.join(out, `${engine}-${width}-${motion}.png`) });
          }
          assert.deepEqual(errors, []);
          results.push({ engine, width, motion, section, initial, history, errors });
          await page.close();
        }
        await context.close();
      }
    await browser.close();
    console.log(
      `${engine}: all four initial fragments, both widths and motion modes, native navigation and history passed`,
    );
  }
  await writeFile(path.join(out, "report.json"), `${JSON.stringify({ base, results }, null, 2)}\n`);
} finally {
  await origin?.close();
}
