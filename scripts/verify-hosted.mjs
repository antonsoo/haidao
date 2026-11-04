import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const base = process.argv[2] ?? "https://antonsoo.github.io/haidao/";
const out = process.argv[3] ?? "/tmp/haidao-hosted.json";
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");
const rows = [];
async function check(name) {
  const local = await readFile(path.join("dist", name));
  const response = await fetch(new URL(name, base), { signal: AbortSignal.timeout(20000) });
  assert.equal(response.status, 200, name);
  const remote = Buffer.from(await response.arrayBuffer());
  assert.ok(local.equals(remote), `Hosted bytes differ for ${name}`);
  return {
    path: name || "./",
    bytes: local.length,
    sha256: sha(local),
    status: response.status,
    contentType: response.headers.get("content-type"),
  };
}
async function visit(folder) {
  for (const item of await readdir(folder, { withFileTypes: true })) {
    const filename = path.join(folder, item.name);
    if (item.isDirectory()) await visit(filename);
    else rows.push(await check(path.relative("dist", filename).split(path.sep).join("/")));
  }
}
const initial = await fetch(base, { signal: AbortSignal.timeout(20000) });
const index = await readFile("dist/index.html");
assert.equal(initial.status, 200);
assert.ok(index.equals(Buffer.from(await initial.arrayBuffer())));
await visit("dist");
const final = await fetch(base, { signal: AbortSignal.timeout(20000) });
assert.equal(final.status, 200);
assert.ok(index.equals(Buffer.from(await final.arrayBuffer())));
await writeFile(
  out,
  `${JSON.stringify({ base, checkedAt: new Date().toISOString(), canonicalDirectorySha256: sha(index), directoryCheckedBeforeAndAfter: true, files: rows }, null, 2)}\n`,
);
console.log(
  `Canonical directory, explicit index and ${rows.length} hosted files match the reviewed dist.`,
);
