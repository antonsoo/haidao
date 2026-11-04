import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";

/** A real origin with controllable header/body failures, without route emulation. */
export async function auditServer(initialRoot = "dist") {
  let root = path.resolve(initialRoot);
  let fault = null;
  let disconnected = false;
  const held = new Set();
  const requests = [];
  let rate = 0;
  const queue = [];
  const pump = setInterval(() => {
    let budget = Math.ceil(rate / 20);
    while (budget > 0 && queue.length) {
      const stream = queue.shift();
      if (stream.res.destroyed) continue;
      const count = Math.min(4096, budget, stream.bytes.length - stream.offset);
      stream.res.write(stream.bytes.subarray(stream.offset, stream.offset + count));
      stream.offset += count;
      stream.entry.received = stream.offset;
      budget -= count;
      if (stream.offset === stream.bytes.length) stream.res.end();
      else queue.push(stream);
    }
  }, 50);
  pump.unref();
  const mime = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".jpg": "image/jpeg",
    ".ttf": "font/ttf",
    ".woff2": "font/woff2",
    ".svg": "image/svg+xml",
    ".txt": "text/plain",
  };
  const server = createServer(async (req, res) => {
    if (disconnected) {
      res.destroy();
      return;
    }
    try {
      const name =
        decodeURIComponent(
          new URL(req.url, "http://localhost").pathname.replace(/^\/haidao\//, ""),
        ) || "index.html";
      if (name.includes("..") || name.startsWith("/")) {
        res.writeHead(400).end();
        return;
      }
      const selected = fault?.name === name ? { ...fault } : null;
      const entry = {
        name,
        mode: selected?.mode ?? "normal",
        received: 0,
        started: Date.now(),
        ended: null,
      };
      requests.push(entry);
      res.once("close", () => {
        entry.ended = Date.now();
      });
      let bytes = await readFile(
        path.join(root, selected?.mode === "wrong" ? "sources/waseda-12.jpg" : name),
      );
      if (selected?.mode === "status") {
        res.writeHead(503).end("Temporarily unavailable");
        return;
      }
      if (selected?.mode === "storage")
        bytes = Buffer.concat([
          bytes,
          Buffer.from(`
const nativeAuditPut = Cache.prototype.put;
Cache.prototype.put = function(request, response) {
  if (new URL(request.url ?? String(request), self.location.href).pathname.endsWith("/sources/waseda-11.jpg"))
    return Promise.reject(new DOMException("Injected storage write failure", "QuotaExceededError"));
  return nativeAuditPut.call(this, request, response);
};
`),
        ]);
      if (selected?.mode === "short") bytes = bytes.subarray(0, 100000);
      if (selected?.mode === "long")
        bytes = Buffer.concat([bytes, Buffer.from("unexpected extra bytes")]);
      const headers = {
        "content-type": mime[path.extname(name)] ?? "application/octet-stream",
        "cache-control": "no-store",
      };
      if (selected?.mode === "headers") {
        const release = () => {
          held.delete(release);
          if (!res.destroyed) res.writeHead(200, headers).end(bytes);
        };
        held.add(release);
        res.once("close", () => held.delete(release));
        return;
      }
      res.writeHead(200, headers);
      if (selected?.mode === "body") {
        res.write(bytes.subarray(0, 1024));
        entry.received = 1024;
        const release = () => {
          held.delete(release);
          if (!res.destroyed) res.end(bytes.subarray(1024));
        };
        held.add(release);
        res.once("close", () => held.delete(release));
      } else if (selected?.mode === "slow") {
        let offset = 0;
        const timer = setInterval(() => {
          if (res.destroyed) {
            clearInterval(timer);
            return;
          }
          const next = Math.min(offset + (selected.chunk ?? 16384), bytes.length);
          res.write(bytes.subarray(offset, next));
          offset = next;
          entry.received = offset;
          if (offset === bytes.length) {
            clearInterval(timer);
            res.end();
          }
        }, selected.interval ?? 300);
        res.once("close", () => clearInterval(timer));
      } else if (rate > 0) {
        queue.push({ res, bytes, offset: 0, entry });
      } else {
        entry.received = bytes.length;
        res.end(bytes);
      }
    } catch {
      if (!res.destroyed) res.writeHead(404).end();
    }
  });
  server.on("connection", (socket) => {
    if (disconnected) socket.destroy();
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  return {
    base: `http://127.0.0.1:${server.address().port}/haidao/`,
    requests,
    throttle(bytesPerSecond) {
      rate = bytesPerSecond;
    },
    fault(value) {
      fault = value;
    },
    root(value) {
      root = path.resolve(value);
    },
    disconnect() {
      disconnected = true;
      server.closeAllConnections();
    },
    reconnect() {
      disconnected = false;
    },
    release() {
      for (const release of [...held]) release();
    },
    async close() {
      clearInterval(pump);
      for (const release of [...held]) release();
      server.closeAllConnections();
      await new Promise((resolve) => server.close(resolve));
    },
  };
}
