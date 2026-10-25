import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { chromium, firefox } from "playwright";

const base = process.argv[2] ?? "http://127.0.0.1:4334/haidao/";
const out = path.resolve(process.argv[3] ?? path.join(tmpdir(), "haidao-browser"));
await mkdir(out, { recursive: true });
const results = [];
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");
for (const [engine, launcher] of [
  ["chromium", chromium],
  ["firefox", firefox],
]) {
  const browser = await launcher.launch();
  for (const width of [1440, 375]) {
    const name = `${engine}-${width}`;
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
      reducedMotion: "reduce",
      acceptDownloads: true,
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const files = [];
    async function save(id, suffix) {
      const event = page.waitForEvent("download");
      await page.locator(`#${id}`).click();
      const download = await event;
      const file = path.join(out, `${name}-${suffix}`);
      await download.saveAs(file);
      const bytes = await readFile(file);
      files.push({ file: path.basename(file), bytes: bytes.length, sha256: sha(bytes) });
      return file;
    }
    await page.goto(base);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() =>
      document.querySelector("#source-status").textContent.includes("identity checked"),
    );
    await page.screenshot({ path: path.join(out, `${name}-initial.png`), fullPage: true });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
    await page.locator("#next-step").focus();
    for (let i = 0; i < 6; i++) await page.keyboard.press("Enter");
    await page.locator("#checks").getByText("Both sightings agree.", { exact: true }).waitFor();
    assert.match(await page.locator("#checks").innerText(), /30750/);
    await page.locator("#choose-gap").click();
    assert.match(await page.locator("#checks").innerText(), /second sighting rejects/);
    assert.match(await page.locator("#checks").innerText(), /-4980\/127/);
    await page
      .locator("#operation")
      .screenshot({ path: path.join(out, `${name}-wrong-divisor.png`) });
    await save("save-csv", "wrong-divisor.csv");
    await save("save-svg", "wrong-divisor.svg");
    await page.locator("#choose-difference").click();
    await page.goBack();
    assert.equal(await page.locator("#choose-gap").getAttribute("aria-pressed"), "true");
    await page.goForward();
    assert.equal(await page.locator("#choose-difference").getAttribute("aria-pressed"), "true");
    // An edited field is not an applied record; a subsequent operation must not erase it.
    await page.locator('[name="front"]').fill("120");
    await page.locator("#previous-step").click();
    assert.equal(await page.locator('[name="front"]').inputValue(), "120");
    assert.match(await page.locator("#record-status").innerText(), /Unapplied edits/);
    const draftCsv = await save("save-csv", "unapplied.csv");
    assert.match(await readFile(draftCsv, "utf8"), /"front_retreat","123"/);
    await page.locator("#source-preset").click();
    await page.locator('[data-diagram="retreats-frame"]').click();
    await page.locator("#retreats-frame").focus();
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(300);
    assert.ok((await page.locator("#retreats-frame").evaluate((el) => el.scrollLeft)) > 0);
    await page.locator('[data-diagram="retreats-frame"]').click();
    for (let i = 0; i < 10; i++) {
      await page.locator("#reading-choice").selectOption(String(i));
      assert.equal(await page.locator("#passage .words>div").count(), 3);
      assert.ok((await page.locator("#passage .chinese").innerText()).length > 10);
    }
    const sourcePages = [];
    for (const p of [9, 10, 11, 12, 13]) {
      await page.locator("#source-page").selectOption(String(p));
      await page.waitForFunction(
        (p) =>
          document
            .querySelector("#source-status")
            .textContent.startsWith(`Opening ${p} · complete`),
        p,
      );
      const hash = await page.locator("#source-frame img").evaluate(async (img) => {
        const bytes = await (await fetch(img.src)).arrayBuffer();
        return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)), (b) =>
          b.toString(16).padStart(2, "0"),
        ).join("");
      });
      sourcePages.push({ page: p, sha256: hash });
    }
    await page.locator("#reading-choice").selectOption("6");
    await page.locator("#read-opening").click();
    await page.waitForFunction(() =>
      document.querySelector("#source-status").textContent.startsWith("Opening 11 · complete"),
    );
    await page.locator("#source-zoom").click();
    const sourceImage = page.locator("#source-frame img");
    const sourceScale = await sourceImage.evaluate((img) => ({
      rendered: img.getBoundingClientRect().width,
      natural: img.naturalWidth,
    }));
    assert.equal(sourceScale.rendered, sourceScale.natural);
    await page
      .locator("#source-frame")
      .screenshot({ path: path.join(out, `${name}-source-full-resolution.png`) });
    const sourceScrollBefore = await page.locator("#source-frame").evaluate((el) => el.scrollLeft);
    await page.locator("#source-frame").focus();
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(300);
    assert.ok(
      (await page.locator("#source-frame").evaluate((el) => el.scrollLeft)) > sourceScrollBefore,
    );
    await page.locator("#source-zoom").click();
    await page.locator("#parallel-preset").click();
    for (let i = 0; i < 6; i++) await page.locator("#next-step").click();
    assert.match(await page.locator("#checks").innerText(), /parallel/);
    await save("save-csv", "parallel.csv");
    assert.match(await page.locator("#calculation").innerText(), /observation separately/);
    await page.locator("#previous-step").click();
    assert.match(await page.locator("#calculation").innerText(), /division by zero/);
    await page.locator("#near-preset").click();
    await page.locator('[name="gap"]').fill("4");
    await page.locator("#observations button[type=submit]").click();
    for (let i = 0; i < 6; i++) await page.locator("#next-step").click();
    await page.locator("#choose-gap").click();
    assert.match(await page.locator("#checks").innerText(), /Both sightings agree/);
    assert.match(await page.locator("#checks").innerText(), /happen to be equal/);
    await save("save-csv", "coincident.csv");
    await save("save-svg", "coincident.svg");
    await page.locator('[name="rear"]').fill("9");
    await page.locator("#observations button[type=submit]").click();
    for (let i = 0; i < 6; i++) await page.locator("#next-step").click();
    assert.match(await page.locator("#checks").innerText(), /Outside the forward-island setup/);
    await page.locator("#source-preset").click();
    for (let i = 0; i < 6; i++) await page.locator("#next-step").click();
    await page.locator('[data-error="4"]').click();
    assert.match(await page.locator("#bounds").innerText(), /2515\/3/);
    assert.match(await page.locator("#bounds").innerText(), /62000/);
    await page.locator('[data-error="8"]').click();
    assert.match(await page.locator("#bounds").innerText(), /No finite upper bound/);
    await page
      .locator("#uncertainty")
      .screenshot({ path: path.join(out, `${name}-unbounded.png`) });
    const csvPath = await save("save-csv", "record.csv");
    assert.match(await readFile(csvPath, "utf8"), /"height_upper","unbounded"/);
    const svgPath = await save("save-svg", "survey.svg");
    assert.match(await readFile(svgPath, "utf8"), /data-height="1255" data-distance="30750"/);
    const htmlPath = await save("save-html", "reading.html");
    // Load the actual downloaded HTML with JavaScript disabled and network unavailable.
    const standaloneContext = await browser.newContext({
      javaScriptEnabled: false,
      offline: true,
      viewport: { width, height: 1000 },
    });
    const standalone = await standaloneContext.newPage();
    await standalone.goto(`file://${htmlPath}`);
    const portable = await standalone.evaluate(() => {
      // Force real layout; page promises are not a useful wait with scripts disabled in Firefox.
      void document.body.offsetHeight;
      return {
        scripts: document.scripts.length,
        readings: document.querySelectorAll("section.reading").length,
        images: [...document.images].map((i) => ({
          complete: i.complete,
          width: i.naturalWidth,
          height: i.naturalHeight,
        })),
        fonts: [...document.fonts].map((f) => ({ family: f.family, status: f.status })),
        overflow: document.documentElement.scrollWidth,
      };
    });
    assert.equal(portable.scripts, 0);
    assert.equal(portable.readings, 10);
    assert.equal(portable.images.length, 5);
    assert.ok(portable.images.every((i) => i.complete && i.width === 3600));
    assert.ok(portable.fonts.every((f) => f.status === "loaded"));
    assert.equal(portable.overflow, width);
    if (engine === "chromium" && width === 1440)
      await standalone.pdf({
        path: path.join(out, "haidao-reading.pdf"),
        printBackground: true,
        preferCSSPageSize: true,
        tagged: true,
        outline: true,
      });
    await standaloneContext.close();
    const axe = await new AxeBuilder({ page }).analyze();
    assert.deepEqual(
      axe.violations.map((v) => v.id),
      [],
    );
    await page.locator("#offline-check").click();
    await page.waitForFunction(() =>
      document.querySelector("#offline-status").textContent.includes("Ready for an offline reload"),
    );
    const offline = await page.locator("#offline-status").innerText();
    await context.setOffline(true);
    await page.reload();
    await page.waitForFunction(() => document.querySelector("#source-frame img")?.complete);
    assert.match(await page.locator("#bounds").innerText(), /No finite upper bound/);
    const offlineHtml = await save("save-html", "offline-reading.html");
    assert.equal(sha(await readFile(offlineHtml)), sha(await readFile(htmlPath)));
    await context.setOffline(false);
    await page.goto(`${base}?front=123&front=124`);
    assert.match(await page.locator("#address-warning").innerText(), /complete source record/);
    assert.equal(await page.locator('[name="front"]').inputValue(), "123");
    assert.deepEqual(errors, []);
    results.push({
      name,
      width,
      errors,
      sourcePages,
      sourceScale,
      portable,
      files,
      offline,
      axeViolations: axe.violations.length,
    });
    console.log(
      `${name}: source, both divisors, six operations, history, drafts, keyboard panning, ten readings, five openings, degeneracies, intervals, native files, script-free offline HTML, offline reload, accessibility passed`,
    );
    await context.close();
  }
  await browser.close();
}
await writeFile(path.join(out, "report.json"), `${JSON.stringify({ base, results }, null, 2)}\n`);
