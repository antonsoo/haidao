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
    await page.goto(`${base}?error=2&probe=37&rearProbe=-61#uncertainty`);
    await page.locator("#rear-error-probe").focus();
    await page.keyboard.press("ArrowRight");
    assert.equal(await page.locator("#error-probe").inputValue(), "37");
    assert.equal(await page.locator("#rear-error-probe").inputValue(), "-60");
    assert.match(
      await page.locator("#error-witness").innerText(),
      /H = 250515\/103 bu; D = 6187000\/103 bu/,
    );
    const selected = page.locator("#error-diagram [data-probe]");
    assert.equal(await selected.getAttribute("cx"), "252");
    assert.equal(await selected.getAttribute("cy"), "215");
    await save("save-csv", "unequal.csv");
    await page.locator("#equal-errors").click();
    assert.equal(await page.locator("#rear-error-probe").inputValue(), "37");
    assert.match(await page.locator("#error-witness").innerText(), /H = 1255 bu; D = 30935 bu/);
    assert.match(await page.locator("#bounds").innerText(), /No finite upper bound/);
    await page.locator("#error-mode").selectOption("shared");
    assert.equal(await page.locator("#rear-error-probe").isDisabled(), true);
    assert.match(await page.locator("#bounds").innerText(), /1255/);
    await page.locator("#error-mode").selectOption("independent");
    assert.equal(await page.locator("#rear-error-probe").isEnabled(), true);
    await page.locator("#opposed-errors").click();
    assert.equal(await page.locator("#rear-error-probe").inputValue(), "-37");
    await page.locator("#try-errors").click();
    assert.equal(await page.locator("#error-probe").inputValue(), "99");
    assert.equal(await page.locator("#rear-error-probe").inputValue(), "-99");
    assert.match(await page.locator("#error-witness").innerText(), /H = 125005 bu; D = 3124500 bu/);
    const comparison = page.locator('#error-comparison [data-error-model="shared"]');
    assert.match(await comparison.innerText(), /1255/);
    assert.match(await comparison.innerText(), /30250 to 31250/);
    await page.locator("#error-probe").focus();
    await page.keyboard.press("ArrowRight");
    await page.locator("#rear-error-probe").focus();
    await page.keyboard.press("ArrowLeft");
    assert.equal(
      await page.locator("#error-witness .witness-result").getAttribute("data-kind"),
      "parallel",
    );
    await page.locator("#error-mode").selectOption("shared");
    assert.match(await page.locator("#bounds").innerText(), /30250/);
    assert.match(await page.locator("#bounds").innerText(), /31250/);
    assert.match(await page.locator("#error-witness").innerText(), /H = 1255 bu; D = 31250 bu/);
    const sharedUrl = page.url();
    assert.equal(new URL(sharedUrl).searchParams.get("errorMode"), "shared");
    await page.reload();
    assert.equal(await page.locator("#error-mode").inputValue(), "shared");
    assert.equal(await page.locator("#error-probe").inputValue(), "100");
    const sharedCsv = await save("save-csv", "shared.csv");
    assert.match(await readFile(sharedCsv, "utf8"), /"error_model","shared"/);
    assert.match(await readFile(sharedCsv, "utf8"), /"probe_distance","31250"/);
    const sharedHtml = await save("save-html", "shared-reading.html");
    assert.match(await readFile(sharedHtml, "utf8"), /H = 1255 bu; D = 31250 bu/);
    await page.locator("#error-mode").selectOption("independent");
    await page.goBack();
    assert.equal(await page.locator("#error-mode").inputValue(), "shared");
    await page.goForward();
    assert.equal(await page.locator("#error-mode").inputValue(), "independent");
    // The reference line crosses the square above the original ±2 bu allowance.
    await page.locator("#error-width").evaluate((el) => {
      el.value = "12";
      el.dispatchEvent(new Event("input", { bubbles: true }));
    });
    assert.equal(
      await page.locator("#error-witness .witness-result").getAttribute("data-kind"),
      "behind",
    );
    await page.locator("#uncertainty").screenshot({ path: path.join(out, `${name}-errors.png`) });
    await page.locator('[data-error="8"]').click();
    await page.locator("#error-mode").selectOption("shared");
    await page.locator("#uncertainty").screenshot({ path: path.join(out, `${name}-shared.png`) });
    await page.locator("#error-mode").selectOption("independent");
    await page.locator("#error-probe").evaluate((el) => {
      el.value = "99";
      el.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await page.locator("#opposed-errors").click();
    await page
      .locator("#uncertainty")
      .screenshot({ path: path.join(out, `${name}-comparison.png`) });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
    await save("save-csv", "comparison.csv");
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
    await standalone.goto(`file://${sharedHtml}`);
    assert.match(
      await standalone.locator(".witness-result").innerText(),
      /H = 1255 bu; D = 31250 bu/,
    );
    assert.equal(await standalone.locator("script").count(), 0);
    assert.equal(await standalone.evaluate(() => document.documentElement.scrollWidth), width);
    if (engine === "chromium" && width === 1440)
      await standalone.pdf({
        path: path.join(out, "shared-reading.pdf"),
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
    assert.equal(await page.locator("#error-mode").inputValue(), "independent");
    assert.equal(await page.locator("#error-probe").inputValue(), "99");
    assert.match(await page.locator("#error-witness").innerText(), /125005/);
    await page.locator("#error-mode").selectOption("shared");
    assert.match(await page.locator("#error-witness").innerText(), /H = 1255/);
    await page.locator("#error-mode").selectOption("independent");
    const offlineHtml = await save("save-html", "offline-reading.html");
    assert.equal(sha(await readFile(offlineHtml)), sha(await readFile(htmlPath)));
    await context.setOffline(false);
    await page.goto(`${base}?front=123&front=124`);
    assert.match(await page.locator("#address-warning").innerText(), /complete source record/);
    assert.equal(await page.locator('[name="front"]').inputValue(), "123");
    await page.locator("#choose-gap").click();
    assert.equal(await page.locator("#address-warning").textContent(), "");
    await page.goBack();
    assert.match(await page.locator("#address-warning").textContent(), /complete source record/);
    await page.locator("#parallel-preset").click();
    await page.locator('[data-error="8"]').click();
    await page.locator("#error-mode").selectOption("shared");
    assert.match(await page.locator("#bounds").textContent(), /No forward island/);
    assert.match(await page.locator("#error-comparison").textContent(), /When b − a is positive/);
    assert.equal(
      await page.locator("#error-witness .witness-result").getAttribute("data-kind"),
      "parallel",
    );
    await page.locator("#error-mode").selectOption("independent");
    assert.match(await page.locator("#bounds").textContent(), /No finite upper bound/);
    assert.equal(await page.locator("#address-warning").textContent(), "");
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
