/**
 * Read and verify one retained file. The clock measures inactivity, not total
 * transfer time. This dependency-free function is also embedded in the worker.
 */
export async function verifiedResponse(url, expected, options = {}) {
  const abort = new AbortController();
  const signal = options.signal ? AbortSignal.any([options.signal, abort.signal]) : abort.signal;
  let timer;
  const arm = () => {
    clearTimeout(timer);
    timer = setTimeout(
      () =>
        abort.abort(
          new DOMException(
            "No data arrived for 15 seconds. Check the connection and retry.",
            "TimeoutError",
          ),
        ),
      15000,
    );
  };
  arm();
  let reader;
  try {
    const response = await fetch(url, { cache: options.cache ?? "no-cache", signal });
    if (!response.ok) throw new Error(`Could not load the retained file (${response.status}).`);
    arm();
    reader = response.body?.getReader();
    if (!reader) throw new Error("The retained file has no readable body.");
    const bytes = new Uint8Array(expected.bytes);
    let received = 0;
    options.onProgress?.(0, expected.bytes);
    for (;;) {
      const { done, value } = await reader.read();
      signal.throwIfAborted();
      if (done) break;
      arm();
      if (received + value.length > expected.bytes)
        throw new Error("The identity check failed: the retained file is larger than expected.");
      bytes.set(value, received);
      received += value.length;
      options.onProgress?.(received, expected.bytes);
    }
    clearTimeout(timer);
    signal.throwIfAborted();
    const digest = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)), (b) =>
      b.toString(16).padStart(2, "0"),
    ).join("");
    if (received !== expected.bytes || digest !== expected.sha256)
      throw new Error(
        "The identity check failed for the retained file. Reload or retry with the complete edition.",
      );
    signal.throwIfAborted();
    const headers = new Headers(response.headers);
    // Fetch has already decoded a compressed HTTP body. Retain its actual bytes.
    headers.delete("content-encoding");
    headers.set("content-length", String(received));
    return new Response(bytes, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } catch (error) {
    abort.abort(error);
    if (reader) await reader.cancel().catch(() => {});
    throw signal.reason ?? error;
  } finally {
    clearTimeout(timer);
    reader?.releaseLock();
  }
}
