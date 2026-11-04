# Same allowance. Different islands.

Review date: 2026-11-03. This addition extends Haidao's existing uncertainty
experiment; it adds no historical precision claim or new reconstruction.

The reproduced starting point was a single independent-error interval control.
It could show an unbounded height at ±2 bu, but offered no way to ask whether
those errors were permitted to vary separately. The new comparison holds the
observations and per-reading allowance fixed while changing the allowed pairs.

## What the learner can do

Open **Uncertainty**, then **Try the source at ±2 bu**. The selected opposing
pair at 99% gives `a=6249/50`, `b=6251/50`, `H=125005`, `D=3124500` bu.
A right-arrow step to 100% produces parallel sightings. Switch to shared
offsets at the same setting: `a=125`, `b=129`, `H=1255`, `D=31250` bu.
The applied observations and recipe stay unchanged throughout.

| Complete allowed set at ±2 bu | Difference, bu | Height, bu | Distance, bu |
| --- | --- | --- | --- |
| Independent square | 0 to 8 | 630; unbounded above | 15125; unbounded above |
| Shared additive diagonal | 4 | 1255 | 30250 to 31250 |

The error diagram shows the square or shared diagonal, the selected pair and
the parallel locus. A locus touching just one corner gets a visible red ring.
At ±3 bu an opposing endpoint reverses the geometry; it remains visible as
outside the forward-island setup. At zero allowance only the origin is allowed.
The independent slider explicitly traces opposing errors rather than pretending
to visit the entire square. The bounds cover the complete square.

The existing source reader remains beside this modern experiment. I inspected
retained whole Waseda openings 10 and 11 directly: the stated observations,
procedure and small correction remain distinct. Live refresh attempts returned
HTTP 503 from the Waseda catalogue and HTTP 403 from the retained PDF URL in
this environment. No fresh PDF acquisition, catalogue availability or new
source identity is claimed. The source images in native exports were decoded
and compared to the retained manifest hashes.

## Operated evidence

A fresh `npm ci` installed 29 packages; the audit reported no vulnerabilities.
`npm run check` passed lint, strict type checking, seven meaningful model/URL
cases and the production build. Commands used for the additional evidence:

```sh
npm run verify:survey
npm run preview
node scripts/browser-check.mjs http://127.0.0.1:4333/haidao/ /tmp/haidao-browser
python3 scripts/error-artifacts.py /tmp/haidao-browser
node scripts/source-guards.mjs /tmp/haidao-source-guards.json
```

The build command is `npm run build`; output is `dist/`, base `/haidao/`.
The development and preview commands both reserve port 4333; run one at a time.

| Evidence | Result and boundary |
| --- | --- |
| [Exact oracle](evidence/shared-offset/oracle.json) | Python Fraction line determinants, 3005 records, 6009 candidate comparisons, 121132 independent-set samples, 31395 shared-offset samples and 42070 trace witnesses |
| [Browser journeys](evidence/shared-offset/browser.json) | Chromium and Firefox, 1440 and 375 px; keyboard, history, reload, both assumptions, parallel and reversed pairs, all readings and sources, actual downloads; zero reported page errors and zero axe violations in the checked states |
| [Native-file oracle](evidence/shared-offset/artifacts.json) | Eight CSVs and twelve downloaded readings: independent intersections, both bounds, SVG marker coordinates, license notices and all five decoded original source images |
| Portable readings | Actual downloaded HTML opened with scripts disabled and browser networking unavailable; both assumptions retained, source images and embedded fonts loaded; no horizontal page overflow |
| Offline edition | Complete inventory checked before browser-offline reload; assumption and probe restored; switching assumptions and saving the same illustrated reading still worked |
| [Failure checks](evidence/shared-offset/source-guards.json) | Wrong source bytes refused by reader/export; held installation did not claim ready; late response did not replace the chosen opening; deleted cache detected without creating a new one, then repaired |
| [Local build bytes](evidence/shared-offset/local-build.json) | Every one of 19 locally served production files matched `dist/` byte for byte; this is not a hosted-site receipt |

The [desktop screenshot](assets/shared-offset-desktop.png) and
[phone screenshot](assets/shared-offset-mobile.png) were inspected directly.
The layout retains the existing restrained field notebook. The exact comparison
table deliberately scrolls horizontally on a phone, with visible instructions;
controls and text remain within the page. The 27-page native PDF was inspected
at its new comparison/diagram pages. Fonts, table columns and the complete
witness fit those pages. Its long license/source appendix is retained rather
than removed for brevity. The shared PDF is untagged; physical printing and
assistive-technology use are not established by this review.

## Retained work and limits

[Actual HTML, compressed](../examples/shared-offset/reading.html.gz),
[PDF](../examples/shared-offset/reading.pdf), and
[CSV](../examples/shared-offset/record.csv) were saved through the final browser
interface. Decompress the HTML before opening it. It needs no scripts or
network and retains the exact state, source images, fonts and complete licenses.

```sh
gzip -dc examples/shared-offset/reading.html.gz > /tmp/haidao-shared-reading.html
```

Neither allowed set is an assertion about ancient measuring practice.
“Independent” describes a Cartesian product, not statistical independence of
random variables. A common multiplicative scale error is not the additive
model. Pole height/gap, terrain, refraction and eye height remain outside this
experiment. Nonpositive allowed retreats invalidate the complete bound rather
than being silently clipped. Older shared addresses default to independent
errors and the zero probe.

No push, publication, public-byte comparison or remote CI result belongs to
this change. The supplied Pages workflow is unchanged. A local preview does
not prove public delivery.

Suggested repository description: “Read Liu Hui's island survey, test both
sightings, and discover how shared errors change the inferred island.”
Suggested topics: `liu-hui`, `history-of-mathematics`, `classical-chinese`,
`geometry`, `surveying`, `uncertainty`, `education`.
