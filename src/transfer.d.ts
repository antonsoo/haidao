export interface TransferOptions {
  signal?: AbortSignal | undefined;
  cache?: RequestCache | undefined;
  onProgress?: ((received: number, total: number) => void) | undefined;
}
export function verifiedResponse(
  url: string | URL,
  expected: { bytes: number; sha256: string },
  options?: TransferOptions,
): Promise<Response>;
