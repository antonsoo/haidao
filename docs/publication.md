# Public edition, 2026-10-25

The source repository is https://github.com/antonsoo/haidao.
Reviewed source with the retained print correction: `f42a7c4681799710aa617a7bcc14e29a21335580`.
Static branch: `cb47821b10830b117ad29a66e2b876b12d5d9cd2`. The branch is configured as the legacy Pages source
at `/`; the public lesson is https://antonsoo.github.io/haidao/.

The local build command is `npm run build`, output `dist/`, base `/haidao/`.
A clean Node 24.21.0 checkout passed `npm ci` and `npm run check`; all nineteen
output files and all five retained examples matched exactly. See
[evidence/clean-build.json](evidence/clean-build.json).

All nineteen canonical HTTPS output files matched the reviewed build, with the
directory entry and explicit index checked before and after the pass. See
[evidence/hosted-files.json](evidence/hosted-files.json). Old hashed JavaScript
from the first edition is retained on the static branch for existing pages;
extra hosted files are outside that current-output inventory.

The complete operated lesson passed from the public URL in Chromium and Firefox
at 1440 and 375 pixels, including source identities, all ten readings, both
divisors, parallel/reversed/coincident cases, intervals, native files, standalone
HTML with scripts disabled, offline reload, and the bounded Axe check. See
[evidence/hosted-browser.json](evidence/hosted-browser.json).

All 40 corresponding public native HTML/CSV/SVG downloads were byte-identical
to their locally reviewed counterparts. The public printed PDF separately
passed all 120 language fields, tagged/script-free inspection, page bounds and
byte-identical extraction of all five source JPEGs. See
[evidence/hosted-artifacts.json](evidence/hosted-artifacts.json) and
[evidence/hosted-native-parity.json](evidence/hosted-native-parity.json).

These receipts establish the recorded source/build/public-file/browser state.
They do not infer CI execution, physical surveying or physical printing.

## Full-resolution source reader

Source `650d966` improves the small-note reading at phone and desktop sizes.
Static branch `cf8ee84d50d3eefe626be599e012823576dc76bf` publishes it. The updated clean checkout passes
`npm run check`, with all nineteen final output files byte-identical to the
reviewed build. All nineteen canonical public files match that build as well.

The complete public four-configuration lesson replay now also asserts a source
image display width equal to its natural width: 3,600 pixels. Keyboard panning
advances the existing scroll position. Actual before/after photographs are
retained in [source-reading.md](source-reading.md). The held/wrong-source and
cache deletion/rebuild workflows pass for this edition in both engines.

All forty native HTML/CSV/SVG downloads remain byte-identical to the original
print-corrected study files. The public PDF again passes the tagged/script-free,
120-field, page-bound and five identical source-image checks. Its 25 pages retain
3,667 words within page bounds. See the `source-resolution-*` receipts in
[evidence](evidence/). These are distinct clean-build, public-file, browser,
source-guard and native-artifact observations.
