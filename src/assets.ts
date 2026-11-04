import manifest, { edition } from "virtual:source-manifest";
import { verifiedResponse } from "./transfer.js";

export { edition, manifest };
export function assetUrl(path: string): string {
  return new URL(import.meta.env.BASE_URL + path, location.origin).href;
}
export async function verified(
  path: string,
  signal?: AbortSignal,
  onProgress?: (received: number, total: number) => void,
): Promise<Uint8Array<ArrayBuffer>> {
  const entry = manifest.assets.find((a) => a.path === path);
  if (!entry) throw new Error("Unknown source asset.");
  const response = await verifiedResponse(assetUrl(path), entry, { signal, onProgress });
  return new Uint8Array(await response.arrayBuffer());
}
export function base64(bytes: Uint8Array): string {
  let text = "";
  for (let start = 0; start < bytes.length; start += 16384)
    text += String.fromCharCode(...bytes.subarray(start, start + 16384));
  return btoa(text);
}
