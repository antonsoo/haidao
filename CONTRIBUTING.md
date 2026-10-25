# Contributing

Use Node 24 and `npm ci`, then `npm run check`. Model changes should also pass
`npm run verify:survey`, whose independent Python oracle uses the standard
library. For UI changes, operate the affected flow in Chromium and Firefox at
desktop and 375 pixels; check native downloads and keyboard behavior.

Keep new historical statements tied to a witness and location. Mark modern
analysis and uncertainty explicitly. Preserve complete source openings and
licenses. Do not replace a source with a convenient modern translation or add
speculative historical scenes. Cite evidence for any changed transcription.

The source manifest is authoritative. After intentionally replacing a retained
asset, rerun `python3 scripts/source-assets.py` and review the new identity and
provenance. Never edit hashes simply to make an unexpected download pass.
