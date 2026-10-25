import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";

const manifestFile = resolve("public/source-manifest.json");
function editionId(): string {
  const files: [string, string][] = [];
  function visit(folder: string) {
    for (const entry of readdirSync(folder, { withFileTypes: true })) {
      const name = `${folder}/${entry.name}`;
      if (entry.isDirectory()) visit(name);
      else files.push([name, createHash("sha256").update(readFileSync(name)).digest("hex")]);
    }
  }
  visit("src");
  visit("public");
  for (const name of ["index.html", "vite.config.ts", "package-lock.json", "LICENSE"])
    files.push([name, createHash("sha256").update(readFileSync(name)).digest("hex")]);
  return createHash("sha256")
    .update(JSON.stringify(files.sort(([a], [b]) => a.localeCompare(b, "en"))))
    .digest("hex")
    .slice(0, 20);
}
function retainedManifest(): Plugin {
  return {
    name: "retained-manifest",
    resolveId(id) {
      if (id === "virtual:source-manifest") return "\0haidao-source-manifest";
    },
    load(id) {
      if (id !== "\0haidao-source-manifest") return;
      this.addWatchFile(manifestFile);
      return `export const edition = ${JSON.stringify(editionId())}; export default ${readFileSync(manifestFile, "utf8")};`;
    },
    handleHotUpdate(ctx) {
      if (ctx.file !== manifestFile) return;
      const mod = ctx.server.moduleGraph.getModuleById("\0haidao-source-manifest");
      if (mod) ctx.server.moduleGraph.invalidateModule(mod);
      ctx.server.ws.send({ type: "full-reload" });
    },
  };
}
function edition(): Plugin {
  return {
    name: "complete-offline-edition",
    apply: "build",
    closeBundle() {
      const files: Record<string, string> = {};
      function visit(folder: string, prefix = "") {
        for (const entry of readdirSync(folder, { withFileTypes: true })) {
          const name = prefix + entry.name;
          if (entry.isDirectory()) visit(resolve(folder, entry.name), `${name}/`);
          else if (name !== "sw.js")
            files[name] = createHash("sha256")
              .update(readFileSync(resolve(folder, entry.name)))
              .digest("hex");
        }
      }
      // Vite finalizes CSS after generateBundle; hash the actual written bytes.
      visit(resolve("dist"));
      const source = readFileSync("src/worker.js", "utf8")
        .replace("__FILES__", JSON.stringify(files))
        .replaceAll("__EDITION__", editionId());
      writeFileSync("dist/sw.js", source);
    },
  };
}
export default defineConfig({
  base: "/haidao/",
  plugins: [retainedManifest(), edition()],
  build: { target: "es2023" },
});
