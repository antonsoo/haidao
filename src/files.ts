import appLicense from "../LICENSE?raw";
import { base64, manifest, verified } from "./assets.ts";
import { h, readingMarkup, readings, stages } from "./content.ts";
import { bounds, exact, q, record, type State, serialize, solve } from "./core/survey.ts";
import { overview, retreats } from "./drawing.ts";
import { boundsMarkup, calculation, checks } from "./presentation.ts";
import readingCss from "./reading.css?raw";
export function csv(s: State): string {
  const r = record(s),
    m = solve(r),
    b = bounds(r, q(s.error, 4));
  const rows: (string | number)[][] = [
    ["field", "exact_value", "unit", "meaning"],
    [
      "model",
      "Haidao first problem",
      "",
      "Modern exact coordinate model; no physical survey claimed",
    ],
    ["operator_stage", s.step, "0-6", stages[s.step] ?? ""],
    [
      "chosen_divisor",
      s.choice,
      "",
      "Complete computed comparisons below are separate from operator progress",
    ],
    ["pole_height", exact(r.h), "bu", "h"],
    ["pole_gap", exact(r.s), "bu", "s"],
    ["front_retreat", exact(r.a), "bu", "a"],
    ["rear_retreat", exact(r.b), "bu", "b"],
    ["retreat_difference", exact(m.delta), "bu", "b-a"],
    ["intersection_kind", m.kind, "", "forward / parallel / behind"],
    [
      "setback_half_width",
      exact(q(s.error, 4)),
      "bu",
      "independent allowed intervals; h and s exact",
    ],
    ["interval_kind", b.kind, "", "bounded / unbounded / invalid / none"],
  ];
  for (const key of ["difference", "gap"] as const) {
    const c = m[key];
    for (const field of [
      "divisor",
      "height",
      "distance",
      "front",
      "rear",
      "frontResidual",
      "rearResidual",
    ] as const)
      rows.push([
        `${key}_${field}`,
        c ? exact(c[field]) : "undefined",
        "bu",
        field === "front" || field === "rear"
          ? "height independently predicted at candidate x=-D"
          : "complete computed comparison",
      ]);
  }
  if (b.kind === "bounded" || b.kind === "unbounded") {
    rows.push(
      ["height_lower", exact(b.lowH), "bu", "attained"],
      ["distance_lower", exact(b.lowD), "bu", "attained"],
      [
        "height_upper",
        b.kind === "bounded" ? exact(b.highH) : "unbounded",
        "bu",
        "not a clipped finite estimate",
      ],
      [
        "distance_upper",
        b.kind === "bounded" ? exact(b.highD) : "unbounded",
        "bu",
        "not a clipped finite estimate",
      ],
    );
  } else rows.push(["interval_explanation", b.explanation, "", ""]);
  rows.push(
    ["address", `https://antonsoo.github.io/haidao/?${serialize(s)}`, "", "applied state"],
    ["source_pdf", manifest.pdf, "", "public-domain later witness"],
    ["source_pdf_sha256", manifest.pdfSha256, "", "source identity"],
  );
  for (const a of manifest.assets) rows.push(["asset", a.path, "SHA-256", a.sha256]);
  return `${rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\r\n")}\r\n`;
}
export async function svgFile(s: State): Promise<string> {
  const [fontBytes, fontLicense] = await Promise.all([
    verified("fonts/AtkinsonHyperlegibleNext.ttf"),
    verified("fonts/Atkinson-OFL.txt"),
  ]);
  const font = base64(fontBytes);
  return overview(s).replace(
    "<style>",
    `<metadata>${h(JSON.stringify({ state: s, units: "bu", description: "Modern equal-scale model of Haidao problem 1", license: appLicense, fontLicense: new TextDecoder().decode(fontLicense) }))}</metadata><style>@font-face{font-family:Atkinson;src:url(data:font/ttf;base64,${font}) format('truetype');font-weight:200 800}`,
  );
}
export async function readingFile(s: State): Promise<string> {
  const loaded = await Promise.all(
    manifest.assets.map(async (a) => [a.path, await verified(a.path)] as const),
  );
  const assets = new Map(loaded);
  const get = (path: string) => {
    const v = assets.get(path);
    if (!v) throw new Error(`Missing ${path}`);
    return v;
  };
  const text = (path: string) => new TextDecoder().decode(get(path));
  const latin = base64(get("fonts/AtkinsonHyperlegibleNext.ttf")),
    chinese = base64(get("fonts/HaidaoCJK.woff2"));
  const allSources = [9, 10, 11, 12, 13]
    .map(
      (page) =>
        `<section class="source"><h2>Whole opening ${page}</h2><img alt="Complete Waseda photographed opening ${page}, without crop" src="data:image/jpeg;base64,${base64(get(`sources/waseda-${String(page).padStart(2, "0")}.jpg`))}"/><p>PDF page ${page} · ${h(manifest.witness)}</p></section>`,
    )
    .join("");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Haidao — a survey and reading record</title>
<style>@font-face{font-family:Atkinson;src:url(data:font/ttf;base64,${latin}) format('truetype');font-weight:200 800}@font-face{font-family:Haidao;src:url(data:font/woff2;base64,${chinese}) format('woff2')}${readingCss}</style>
</head>
<body>
<p class="eyebrow">Haidao · Sea Island Mathematical Manual · Problem 1</p>
<h1>Check the second sighting.</h1>
<p>Applied record saved at operation ${s.step} of 6: <strong>${h(stages[s.step])}</strong>. The complete calculated comparisons below are provided for inspection; they do not assert the operator finished the recipe.</p>
<p>
<a href="https://antonsoo.github.io/haidao/?${h(serialize(s))}">Reopen this applied state</a> · All lengths in bu; 6 chi = 1 bu, 10 chi = 1 zhang, 300 bu = 1 li. No conversion to metres.</p>
<section>
<h2>Observations and current operation</h2>
<p>h = ${s.pole / 4}; s = ${s.gap / 4}; a = ${s.front / 4}; b = ${s.rear / 4} bu. Proposed divisor: ${h(s.choice)}.</p>${overview(s)}${retreats(s)}${calculation(s)}${checks({ ...s, step: 6 })}<h3>Modern setback intervals</h3>
<p>Each retreat independently ±${s.error / 4} bu; h and s exact.</p>${boundsMarkup(s)}</section>
<section>
<h2>Why one observation is insufficient</h2>
<p>Front pole (0,h), rear pole (s,h), front ground eye (a,0), rear ground eye (s+b,0), island peak (−D,H). Front line: y=h(a−x)/a. Rear line: y=h(s+b−x)/b. Equating them gives D(b−a)=as and H=h+hs/(b−a).</p>
<p>A recipe with any nonzero divisor f produces D=as/f and H=h+hs/f, which always fit the front observation. The rear observation fits only if f=b−a. Equal retreats give parallel lines. A shorter rear retreat puts the intersection outside the forward-island setup. This is modern coordinate analysis, not a transcription of Liu Hui's proof.</p>
<p>This model assumes a level common baseline, equal vertical poles, point-like tips and target, and ground eyes. The chosen interval varies only setbacks; it does not include terrain, pole or eye-height errors, refraction, or any probability distribution.</p>
</section>${readings
    .map(
      (_r, i) => `<section class="reading" id="reading-${i}">
<p class="eyebrow">Reading ${i + 1} of 10 · selected clause</p>${readingMarkup(i)}</section>`,
    )
    .join("")}<section>
<h2>About the witness and renderings</h2>
<p>${h(manifest.witness)}. The Qing preface describes compilation from scattered material in the Yongle Encyclopedia. This is a later witness to an ancient work, not a third-century manuscript. The received commentary and the small editorial correction have separate voices.</p>
<p>Chinese clauses were transcribed for this edition from the retained photographs. Modern punctuation is supplied; English renderings and the coordinate model are new. Modern Mandarin pinyin is a reading aid, not reconstructed ancient pronunciation. The text is excerpted; this is not a complete critical edition. The source exercise is not an identified physical expedition.</p>
<p>
<a href="${h(manifest.commons)}">Scan and catalogue</a> · <a href="${h(manifest.pdf)}">Complete source PDF</a> · <a href="https://doi.org/10.1016/0315-0860(86)90024-8">Ang Tian Se and Frank J. Swetz (1986), historical study</a>. That study's translation and figures are not reproduced.</p>
<p>${h(manifest.description)}</p>
</section>${allSources}<section class="worksheet">
<h2>Work the survey again</h2>
<p>Record h, s, a and b:</p>
<p>Compute the height dividend hs:</p>
<p>What is 相多? Give a proposed divisor f:</p>
<p>Compute H = h + hs/f and D = as/f:</p>
<p>Front line at x = −D; candidate minus front:</p>
<p>Rear line at x = −D; candidate minus rear:</p>
<p>Choose allowed retreat intervals. Can b − a approach zero?</p>
</section>
<section>
<h2>Exact machine-readable record</h2>
<pre id="exact-record">${h(csv(s))}</pre>
<h2>Source identities</h2>
<pre id="source-manifest">${h(JSON.stringify(manifest, null, 2))}</pre>
<h2>Licenses</h2>
<p>Whole photographs: public domain. Original app, diagrams, selected transcription and new English:</p>
<pre>${h(appLicense)}</pre>
<h3>Atkinson Hyperlegible Next</h3>
<pre>${h(text("fonts/Atkinson-OFL.txt"))}</pre>
<h3>Haidao CJK, subset of Noto Sans CJK</h3>
<pre>${h(text("fonts/Noto-NOTICE.txt"))}</pre>
<pre>${h(text("fonts/Noto-OFL.txt"))}</pre>
<pre>${h(text("fonts/provenance.json"))}</pre>
<p>This complete HTML has no script and needs no network to read or print.</p>
</section>
</body>
</html>`;
}
export function download(text: string, mime: string, filename: string): void {
  const url = URL.createObjectURL(new Blob([text], { type: mime }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
