import { h } from "./content.ts";
import { bounds, errorWitness, exact, number, q, record, type State, sub } from "./core/survey.ts";

export const errorNames = { independent: "Independent errors", shared: "Shared additive offset" };
export function errorDiagram(s: State): string {
  const e = s.error / 4,
    t = s.probe / 100,
    shared = s.errorMode === "shared",
    v = (shared ? s.probe : s.rearProbe) / 100;
  const delta = number(sub(record(s).b, record(s).a));
  const shift = e ? delta / e : 0;
  const lo = Math.max(-1, shift - 1),
    hi = Math.min(1, shift + 1);
  const x = (v: number) => 215 + v * 100,
    y = (v: number) => 155 - v * 100;
  const parallel =
    e > 0 && lo <= hi
      ? `${lo === hi ? `<circle cx="${x(lo)}" cy="${y(lo - shift)}" r="11" fill="none" stroke="#973e25" stroke-width="3"/>` : `<path d="M${x(lo)} ${y(lo - shift)}L${x(hi)} ${y(hi - shift)}" stroke="#973e25" stroke-width="3" stroke-dasharray="5 4"/>`}<text x="320" y="300" text-anchor="end" style="fill:#973e25">${lo === hi ? "Red ring: parallel pair" : "Dashed red: parallel sightings"}</text>`
      : "";
  return `<svg class="error-plane" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 350" role="img" aria-label="Allowed error pairs. ${e === 0 ? "Zero allowance: only the origin is allowed." : shared ? "Only the rising diagonal is allowed: both errors are equal." : "The entire square is allowed; front and rear errors are selected separately."}">
<style>.error-plane text{font:15px Atkinson,sans-serif;fill:#203b43}.error-plane .tiny{font-size:13px}</style>
<rect width="420" height="350" fill="#f3f6f3"/>
<path d="M115 55H315V255H115Z" fill="${!shared && e ? "#dce9e1" : "none"}" stroke="#8aaba8"/>
<path d="M95 155H335M215 275V35" stroke="#8aaba8"/>
${e && shared ? `<path d="M115 255L315 55" stroke="#006c74" stroke-width="5"/>` : ""}${e ? parallel : ""}
<circle cx="${e ? x(t) : 215}" cy="${e ? y(v) : 155}" r="7" fill="#203b43" stroke="#f3f6f3" stroke-width="2" data-probe="${s.probe}" data-rear-probe="${shared ? s.probe : s.rearProbe}"/>
<text x="115" y="278" text-anchor="middle">−e</text><text x="215" y="278" text-anchor="middle">0</text><text x="315" y="278" text-anchor="middle">+e</text>
<text x="101" y="60" text-anchor="end">+e</text><text x="101" y="160" text-anchor="end">0</text><text x="101" y="260" text-anchor="end">−e</text>
<text x="215" y="325" text-anchor="middle">Front error u · e = ${e} bu</text>
<text transform="translate(35 155) rotate(-90)" text-anchor="middle">Rear error v</text>
<text class="tiny" x="215" y="20" text-anchor="middle">${e === 0 ? "Exact readings: one allowed pair" : shared ? "Equal errors: v = u" : "Any pair in the shaded square"}</text>
</svg>`;
}
export function comparisonMarkup(s: State): string {
  const rows = (["independent", "shared"] as const).map((mode) => {
    const b = bounds(record(s), q(s.error, 4), mode);
    const range = (low: string, high: string) => (low === high ? low : `${low} to ${high}`);
    const cells =
      b.kind === "invalid" || b.kind === "none"
        ? `<td colspan="3">${h(b.explanation)}</td>`
        : `<td>${range(exact(b.deltaLow), exact(b.deltaHigh))}</td><td>${range(exact(b.lowH), b.kind === "bounded" ? exact(b.highH) : "unbounded")}</td><td>${range(exact(b.lowD), b.kind === "bounded" ? exact(b.highD) : "unbounded")}</td>`;
    return `<tr data-error-model="${mode}"><th scope="row">${errorNames[mode]}</th>${cells}</tr>`;
  });
  return `<h3>Same allowance. Different allowed pairs.</h3><div class="comparison-scroll" tabindex="0" role="region" aria-label="Exact bounds for both error assumptions; scroll horizontally on small screens"><table class="data-table"><caption>Exact bu; h and s fixed. No probabilities assigned.</caption><thead><tr><th scope="col">Assumption</th><th scope="col">b − a</th><th scope="col">Height H</th><th scope="col">Distance D</th></tr></thead><tbody>${rows.join("")}</tbody></table></div><p class="scroll-note">Scroll the table sideways to compare all four columns.</p><p>A shared offset changes both retreats by the same additive amount: (b + u) − (a + u) = b − a. When b − a is positive, height is unchanged and distance changes by su/(b − a). Equal retreats stay parallel under a shared offset. A common scale error would behave differently and is not modeled here.</p>`;
}
export function witnessMarkup(s: State): string {
  const w = errorWitness(s),
    m = w.solution,
    c = m?.difference;
  let result: string;
  if (!m) result = "An adjusted retreat reaches zero or less. Outside the positive-setback model.";
  else if (m.kind === "parallel")
    result =
      "Parallel sightings. No finite common peak; no finite value replaces division by zero.";
  else if (m.kind === "behind")
    result =
      "The intersection is behind the front pole and below pole height. This pair gives no forward island.";
  else if (c)
    result = `H = ${exact(c.height)} bu; D = ${exact(c.distance)} bu. Both point-defined sight lines meet here.`;
  else throw new Error("Missing forward intersection");
  return `<p class="eyebrow">One allowed pair, not the whole bound</p><p>u = ${h(exact(w.frontError))} bu; v = ${h(exact(w.rearError))} bu.<br/>Adjusted a = ${h(exact(w.adjusted.a))} bu; b = ${h(exact(w.adjusted.b))} bu.<br/>b − a = ${h(exact(sub(w.adjusted.b, w.adjusted.a)))} bu.</p><p class="witness-result" data-kind="${m?.kind ?? "invalid"}">${h(result)}</p><p class="source-location">${s.errorMode === "shared" ? "The slider samples shared offsets in 1% steps. Exact bounds include values between samples." : "Both sliders sample the independent square in 1% steps. Exact bounds cover the entire square, including values between samples."} Your applied observations and recipe remain unchanged.</p>${s.errorMode === "independent" && s.error > 0 && exact(w.frontError) === exact(w.rearError) ? '<p class="equal-pair-note">This selected pair has equal errors. The independent assumption still permits unequal errors, so its complete bounds have not narrowed.</p>' : ""}`;
}
