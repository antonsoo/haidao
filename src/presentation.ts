import { h, stages } from "./content.ts";
import { bounds, exact, mul, type Q, q, record, type State, solve, sub } from "./core/survey.ts";
export function length(v: Q): string {
  return `${h(exact(v))} bu`;
}
export function calculation(s: State): string {
  const r = record(s),
    m = solve(r),
    c = m[s.choice],
    f = s.choice === "difference" ? m.delta : r.s;
  const expr = [
    `<p>Keep h = ${length(r.h)}, s = ${length(r.s)}, a = ${length(r.a)} and b = ${length(r.b)}. Each retreat belongs to its own pole.</p>`,
    `<p class="formula">${h(exact(r.h))} × ${h(exact(r.s))} = ${h(exact(mul(r.h, r.s)))}</p><p>Pole height × pole gap. This product is in bu²: it is the dividend, <span lang="zh-Hant">實</span>.</p>`,
    `<p class="formula">${s.choice === "difference" ? `${h(exact(r.b))} − ${h(exact(r.a))}` : "Pole gap"} = ${h(exact(f))} bu</p><p>${s.choice === "difference" ? "The editorial note uses the difference between the two retreats." : "The received commentary's wording uses the distance between poles. Carry it through and check it."} This is the proposed divisor, <span lang="zh-Hant">法</span>.</p>`,
    c
      ? `<p class="formula">${h(exact(mul(r.h, r.s)))} ÷ ${h(exact(f))} = ${h(exact(sub(c.height, r.h)))}</p><p>The quotient measures the candidate height above the pole tip.</p>`
      : `<p>Division is undefined: the proposed divisor is zero. No quotient has been invented.</p>`,
    c
      ? `<p class="formula">H = ${h(exact(c.height))} bu</p><p>Add the pole height to the quotient. ${isSource(s) && s.choice === "difference" ? "This is 4 li and 55 bu, the source's answer." : "This is a candidate. It still needs the observations."}</p>`
      : `<p>No candidate height: division by zero is undefined.</p>`,
    c
      ? `<p class="formula">D = ${h(exact(r.a))} × ${h(exact(r.s))} ÷ ${h(exact(f))}<br />= ${h(exact(c.distance))} bu</p><p>Distance is measured from the front pole. ${isSource(s) && s.choice === "difference" ? "This is 102 li and 150 bu." : "The source's distance procedure uses the same divisor."}</p>`
      : `<p>No candidate distance: division by zero is undefined.</p>`,
    `<p>Put the candidate peak at x = −D. Ask each observation separately what height its line has there. A consistent peak must match both.</p>`,
  ];
  return `<h3>${h(stages[s.step])}</h3>${expr[s.step]}`;
}
export function checks(s: State): string {
  const m = solve(record(s)),
    c = m[s.choice];
  if (s.step < 6)
    return `<p class="check-data">The two sighting checks appear after the distance operation.</p>`;
  let context = "";
  if (m.kind === "parallel")
    context = `<p class="check bad"><strong>The observations are parallel.</strong>Equal positive retreats give equal slopes but different line heights. There is no finite common peak. The zero difference remains visible.</p>`;
  if (m.kind === "behind")
    context = `<p class="check bad"><strong>Outside the forward-island setup.</strong>The rear retreat is shorter. The line intersection is behind the front pole and below pole height; it is not a forward island.</p>`;
  if (!c) return `${context}<p>No candidate exists for the selected zero divisor.</p>`;
  const match = c.frontResidual.n === 0n && c.rearResidual.n === 0n;
  return `${context}<p class="check ${match ? "good" : "bad"}"><strong>${match ? "Both sightings agree." : "The second sighting rejects this candidate."}</strong> ${match && m.kind !== "forward" ? "The algebraic intersection is outside the source's forward geometry." : match ? "The peak fits the two independent observations." : "The first sighting alone would have accepted it."}</p><table class="data-table"><caption class="check-data">At the candidate distance D = ${length(c.distance)}</caption><thead><tr><th scope="col">Height</th><th scope="col">Exact bu</th></tr></thead><tbody><tr><th scope="row">Candidate</th><td>${h(exact(c.height))}</td></tr><tr><th scope="row">Front line</th><td>${h(exact(c.front))}</td></tr><tr><th scope="row">Rear line</th><td>${h(exact(c.rear))}</td></tr><tr><th scope="row">Candidate − rear</th><td>${h(exact(c.rearResidual))}</td></tr></tbody></table>${m.delta.n * record(s).s.d === record(s).s.n * m.delta.d ? '<p class="check-data">For this record the two proposed divisors happen to be equal. Both choices therefore give the same result.</p>' : ""}`;
}
export function boundsMarkup(s: State): string {
  const r = record(s),
    b = bounds(r, q(s.error, 4));
  if (b.kind === "invalid" || b.kind === "none")
    return `<h3>${b.kind === "invalid" ? "Outside the interval model" : "No forward island in this interval"}</h3><p>${h(b.explanation)}</p>`;
  const upperH = b.kind === "bounded" ? length(b.highH) : "No finite upper bound";
  const upperD = b.kind === "bounded" ? length(b.highD) : "No finite upper bound";
  return `<p class="eyebrow">Allowed retreat difference</p><p class="formula">${h(exact(b.deltaLow))} to ${h(exact(b.deltaHigh))} bu</p><h3>${b.kind === "bounded" ? "A bounded family of islands" : "No finite upper bound"}</h3><table class="data-table"><thead><tr><th scope="col">Quantity</th><th scope="col">Smallest</th><th scope="col">Largest</th></tr></thead><tbody><tr><th scope="row">Height H</th><td>${length(b.lowH)}</td><td>${upperH}</td></tr><tr><th scope="row">Distance D</th><td>${length(b.lowD)}</td><td>${upperD}</td></tr></tbody></table><p>${b.kind === "bounded" ? "Both extrema are attained: smallest at the shortest front / longest rear retreat; largest at the longest front / shortest rear retreat." : "Allowed forward cases approach a zero positive retreat difference. Height and distance grow without limit. Other allowed pairs may be parallel or outside the forward setup; none has been silently removed from the record."}</p><p class="source-location">These are exact interval bounds under the modern model, not a confidence interval. The front and rear retreats are allowed to vary independently.</p>`;
}
export function isSource(s: State): boolean {
  return s.pole === 20 && s.gap === 4000 && s.front === 492 && s.rear === 508;
}
