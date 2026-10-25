import manifest, { edition } from "virtual:source-manifest";

export { edition, manifest };
export function assetUrl(path: string): string {
  return new URL(import.meta.env.BASE_URL + path, location.origin).href;
}
export async function verified(
  path: string,
  signal?: AbortSignal,
): Promise<Uint8Array<ArrayBuffer>> {
  const entry = manifest.assets.find((a) => a.path === path);
  if (!entry) throw new Error("Unknown source asset.");
  const response = await fetch(assetUrl(path), {
    cache: "no-cache",
    signal: signal
      ? AbortSignal.any([signal, AbortSignal.timeout(15000)])
      : AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`Could not load ${path} (${response.status}).`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  const hash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
  if (bytes.length !== entry.bytes || hash !== entry.sha256)
    throw new Error(
      `The identity check failed for ${path}. Reload or retry with the complete edition.`,
    );
  return bytes;
}
export function base64(bytes: Uint8Array): string {
  let text = "";
  for (let start = 0; start < bytes.length; start += 16384)
    text += String.fromCharCode(...bytes.subarray(start, start + 16384));
  return btoa(text);
}
