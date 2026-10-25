import { h } from "./content.ts";
import { type Candidate, exact, number, record, type State, solve } from "./core/survey.ts";

const style = `<style>text{font-family:Atkinson,Arial,sans-serif;font-size:16px;fill:#203b43}.ground{stroke:#899a9c;stroke-width:1}.front{stroke:#007d85;fill:none;stroke-width:2.5}.rear{stroke:#ad4d2c;fill:none;stroke-width:2.5;stroke-dasharray:9 5}.pole{stroke:#203b43;stroke-width:3}.point{fill:#203b43}.ghost{fill:none;stroke:#687f86;stroke-width:1.5;stroke-dasharray:3 4}.dim{stroke:#637c80;fill:none;stroke-width:1}.small{font-size:13px}.label{font-size:15px}.candidate{stroke:#203b43;fill:none;stroke-width:2}.value{font-weight:700}</style>`;
function svg(title: string, desc: string, height: number, body: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 ${height}" role="img" aria-label="${h(title)}"><title>${h(title)}</title><desc>${h(desc)}</desc>${style}<rect width="1000" height="${height}" fill="#f3f6f3"/>${body}</svg>`;
}
export function overview(state: State): string {
  const r = record(state),
    m = solve(r),
    c = m[state.choice];
  const H = number(r.h),
    S = number(r.s),
    A = number(r.a),
    B = number(r.b);
  const truth = m.kind === "forward" ? m.difference : null;
  const positive = [truth, c].filter(
    (v): v is Candidate => !!v && number(v.distance) > 0 && number(v.height) > 0,
  );
  const distance = Math.max(A, S, ...positive.map((v) => number(v.distance)));
  const high = Math.max(H, ...positive.map((v) => number(v.height)));
  const left = -distance * 1.03,
    right = S + B + (distance + S + B) * 0.03;
  const scale = Math.min(890 / (right - left), 310 / high);
  const ground = 60 + high * scale;
  const height = Math.max(190, ground + 95);
  const x = (v: number) => 55 + (v - left) * scale,
    y = (v: number) => ground - v * scale;
  const frontAt = (v: number) => (H * (A - v)) / A;
  const rearAt = (v: number) => (H * (S + B - v)) / B;
  const lineStart = truth ? -number(truth.distance) : -Math.min(distance, 2 * (S + B));
  let body = `<text x="28" y="27" class="small">WHOLE SURVEY · SAME SCALE IN BOTH DIRECTIONS · ALL LENGTHS IN BU</text><line class="ground" x1="28" y1="${ground}" x2="972" y2="${ground}"/>`;
  // For inconsistent records, clip the observed rays to the displayed vertical extent.
  const startFront = Math.max(lineStart, A - ((high + H * 0.1) * A) / H);
  const startRear = Math.max(lineStart, S + B - ((high + H * 0.1) * B) / H);
  body += `<line class="front" x1="${x(startFront)}" y1="${y(frontAt(startFront))}" x2="${x(A)}" y2="${ground}"/><line class="rear" x1="${x(startRear)}" y1="${y(rearAt(startRear))}" x2="${x(S + B)}" y2="${ground}"/>`;
  for (const p of [0, S])
    body += `<line class="pole" x1="${x(p)}" y1="${ground}" x2="${x(p)}" y2="${y(H)}"/><circle class="point" cx="${x(p)}" cy="${y(H)}" r="3"/>`;
  body += `<text x="${Math.min(x(0), 760)}" y="${ground + 31}" class="small">Front pole → rear pole →</text><text x="${Math.min(x(0), 760)}" y="${ground + 49}" class="small">Poles h=${h(exact(r.h))}; gap s=${h(exact(r.s))}</text>`;
  if (truth)
    body += `<path class="ghost" d="M${x(-number(truth.distance))},${ground}V${y(number(truth.height))}"/><circle class="ghost" cx="${x(-number(truth.distance))}" cy="${y(number(truth.height))}" r="6"/>`;
  if (c && number(c.height) > 0 && number(c.distance) > 0) {
    const X = x(-number(c.distance)),
      Y = y(number(c.height));
    body += `<path class="candidate" d="M${X},${ground}V${Y}" data-height="${h(exact(c.height))}" data-distance="${h(exact(c.distance))}"/><path class="candidate" d="M${X - 7},${Y - 7}l14,14m-14,0l14,-14"/><text x="${Math.min(Math.max(X + 12, 45), 760)}" y="${Math.max(Y - 14, 51)}" class="label">Candidate peak ×</text>`;
  }
  body += `<text x="28" y="${height - 15}" class="small">Circles locate pole tips even when a pole is smaller than a pixel. The target is a point; no island width is assumed.</text>`;
  return svg(
    "Two independent observations and a candidate island peak",
    "The solid teal ray passes through the front pole and its ground eye. The dashed rust ray passes through the rear pole and its ground eye. Both use the same horizontal and vertical scale. A cross marks the calculated candidate; a dotted line marks the forward intersection when it exists.",
    height,
    body,
  );
}
export function retreats(state: State): string {
  const r = record(state),
    A = number(r.a),
    B = number(r.b),
    scale = 740 / Math.max(A, B);
  const x = (v: number) => 140 + v * scale;
  const body = `<text x="28" y="27" class="small">SETBACK RULERS · EACH STARTS AT ITS OWN POLE · ONE COMMON SCALE</text><text x="28" y="76">Front</text><line class="front" x1="140" y1="70" x2="${x(A)}" y2="70"/><circle cx="${x(A)}" cy="70" r="5" fill="#007d85"/><text x="${x(A) + 12}" y="76">${h(exact(r.a))}</text><text x="28" y="123">Rear</text><line class="rear" x1="140" y1="117" x2="${x(B)}" y2="117"/><circle cx="${x(B)}" cy="117" r="5" fill="#ad4d2c"/><text x="${x(B) + 12}" y="123">${h(exact(r.b))}</text><path class="dim" d="M${x(A)},140v20m0,-10H${x(B)}m0,-10v20"/><text x="140" y="188">Rear − front = ${h(exact(solve(r).delta))} bu. This is not the pole gap.</text>`;
  return svg(
    "Compare the two retreats on aligned rulers",
    `Front retreat ${exact(r.a)} bu and rear retreat ${exact(r.b)} bu are shown at one common scale, each measured from its own pole. Their difference is ${exact(solve(r).delta)} bu.`,
    212,
    body,
  );
}
