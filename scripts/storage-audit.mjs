import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, firefox } from "playwright";
import { auditServer } from "./audit-server.mjs";

if (!process.argv[2]) throw new Error("Pass the separately built fc55571 dist directory.");
const out = path.resolve(process.argv[3] ?? "/tmp/haidao-storage-audit");
await mkdir(out, { recursive: true });
const results = [];
for (const [version, root] of [
  ["before", process.argv[2]],
  ["current", "dist"],
]) {
  const origin = await auditServer(root);
  try {
    for (const [engine, launcher] of [
      ["chromium", chromium],
      ["firefox", firefox],
    ]) {
      const browser = await launcher.launch();
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(origin.base);
      await page.waitForFunction(() =>
        document
          .querySelector("#offline-status")
          .textContent.includes("Ready for an offline reload"),
      );
      const before = await page.evaluate(async () => {
        const names = await caches.keys();
        const cache = await caches.open(names.find((n) => n.startsWith("haidao-")));
        await cache.delete(new URL("sources/waseda-11.jpg", location.href));
        const rows = [];
        for (const req of await cache.keys()) {
          const res = await cache.match(req),
            bytes = await res.arrayBuffer();
          rows.push({
            name: new URL(req.url).pathname,
            hash: [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))]
              .map((b) => b.toString(16).padStart(2, "0"))
              .join(""),
          });
        }
        return rows.sort((a, b) => a.name.localeCompare(b.name));
      });
      origin.fault({ name: "sw.js", mode: "storage" });
      await page.evaluate(async () => {
        window.storageInstallFailed = false;
        const registration = await navigator.serviceWorker.getRegistration();
        registration.addEventListener("updatefound", () => {
          const w = registration.installing;
          w.addEventListener("statechange", () => {
            if (w.state === "redundant") window.storageInstallFailed = true;
          });
        });
        await registration.update();
      });
      await page.waitForFunction(() => window.storageInstallFailed);
      const after = await page.evaluate(async () => {
        const rows = [];
        for (const n of await caches.keys()) {
          const cache = await caches.open(n);
          for (const req of await cache.keys()) {
            const res = await cache.match(req),
              bytes = await res.arrayBuffer();
            rows.push({
              name: new URL(req.url).pathname,
              hash: [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))]
                .map((b) => b.toString(16).padStart(2, "0"))
                .join(""),
            });
          }
        }
        return rows.sort((a, b) => a.name.localeCompare(b.name));
      });
      if (version === "before") assert.equal(after.length, 0);
      else assert.deepEqual(after, before);
      results.push({
        version,
        engine,
        injectedFailure:
          "Cache.put rejects source opening 11 with QuotaExceededError in the candidate worker",
        before,
        after,
      });
      console.log(
        `${version} ${engine}: ${before.length} verified entries before failed storage write; ${after.length} retained after`,
      );
      origin.fault(null);
      await context.close();
      await browser.close();
    }
  } finally {
    await origin.close();
  }
}
await writeFile(path.join(out, "report.json"), `${JSON.stringify({ results }, null, 2)}\n`);
