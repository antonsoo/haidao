declare module "virtual:source-manifest" {
  export const edition: string;
  const manifest: {
    witness: string;
    description: string;
    pdf: string;
    pdfSha256: string;
    commons: string;
    license: string;
    assets: { path: string; bytes: number; sha256: string }[];
  };
  export default manifest;
}
