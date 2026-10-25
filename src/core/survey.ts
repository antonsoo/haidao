/** Exact lengths in bu. Rendering alone converts these fractions to floating point. */
export type Q = Readonly<{ n: bigint; d: bigint }>;
export function q(n: bigint | number, d: bigint | number = 1): Q {
  let a = BigInt(n);
  let b = BigInt(d);
  if (!b) throw new RangeError("A divisor cannot be zero.");
  if (b < 0n) {
    a = -a;
    b = -b;
  }
  let x = a < 0n ? -a : a;
  let y = b;
  while (y) [x, y] = [y, x % y];
  return { n: a / x, d: b / x };
}
export const add = (a: Q, b: Q): Q => q(a.n * b.d + b.n * a.d, a.d * b.d);
export const sub = (a: Q, b: Q): Q => q(a.n * b.d - b.n * a.d, a.d * b.d);
export const mul = (a: Q, b: Q): Q => q(a.n * b.n, a.d * b.d);
export const div = (a: Q, b: Q): Q => q(a.n * b.d, a.d * b.n);
export const number = (a: Q): number => Number(a.n) / Number(a.d);
export const exact = (a: Q): string => (a.d === 1n ? String(a.n) : `${a.n}/${a.d}`);
export const ZERO = q(0);
export interface RecordQ {
  h: Q;
  s: Q;
  a: Q;
  b: Q;
}
export interface Candidate {
  divisor: Q;
  height: Q;
  distance: Q;
  front: Q;
  rear: Q;
  frontResidual: Q;
  rearResidual: Q;
}
export function candidate(r: RecordQ, divisor: Q): Candidate | null {
  if (divisor.n === 0n) return null;
  const height = add(r.h, div(mul(r.h, r.s), divisor));
  const distance = div(mul(r.a, r.s), divisor);
  // Each line comes from its own pole tip and ground eye, independently of the candidate.
  const front = div(mul(r.h, add(r.a, distance)), r.a);
  const rear = div(mul(r.h, add(add(r.s, r.b), distance)), r.b);
  return {
    divisor,
    height,
    distance,
    front,
    rear,
    frontResidual: sub(height, front),
    rearResidual: sub(height, rear),
  };
}
export function solve(r: RecordQ) {
  const delta = sub(r.b, r.a);
  return {
    delta,
    kind: delta.n > 0n ? "forward" : delta.n === 0n ? "parallel" : "behind",
    difference: candidate(r, delta),
    gap: candidate(r, r.s),
  } as const;
}
export type Bounds =
  | { kind: "invalid"; explanation: string }
  | { kind: "none"; explanation: string }
  | { kind: "bounded"; lowH: Q; lowD: Q; highH: Q; highD: Q; deltaLow: Q; deltaHigh: Q }
  | { kind: "unbounded"; lowH: Q; lowD: Q; deltaLow: Q; deltaHigh: Q };
/** Independent, closed setback intervals; h and s remain exact. No probability model. */
export function bounds(r: RecordQ, error: Q): Bounds {
  if (error.n < 0n) return { kind: "invalid", explanation: "The half-width must be nonnegative." };
  const al = sub(r.a, error),
    ah = add(r.a, error),
    bl = sub(r.b, error),
    bh = add(r.b, error);
  if (al.n <= 0n || bl.n <= 0n)
    return {
      kind: "invalid",
      explanation:
        "An allowed setback reaches zero or less. Positive setbacks are required; no interval has been clipped.",
    };
  const deltaLow = sub(bl, ah),
    deltaHigh = sub(bh, al);
  if (deltaHigh.n <= 0n)
    return {
      kind: "none",
      explanation:
        "No allowed pair has a larger rear setback. None gives an island in front of the poles under these assumptions.",
    };
  const low = candidate({ ...r, a: al, b: bh }, deltaHigh);
  if (!low) throw new Error("Positive maximum difference required.");
  if (deltaLow.n <= 0n)
    return { kind: "unbounded", lowH: low.height, lowD: low.distance, deltaLow, deltaHigh };
  const high = candidate({ ...r, a: ah, b: bl }, deltaLow);
  if (!high) throw new Error("Positive minimum difference required.");
  return {
    kind: "bounded",
    lowH: low.height,
    lowD: low.distance,
    highH: high.height,
    highD: high.distance,
    deltaLow,
    deltaHigh,
  };
}

// Input integers count quarter-bu; this avoids decimal roundoff before exact arithmetic.
export interface State {
  pole: number;
  gap: number;
  front: number;
  rear: number;
  error: number;
  choice: "difference" | "gap";
  step: number;
  read: number;
  page: number;
}
export const INITIAL: State = {
  pole: 20,
  gap: 4000,
  front: 492,
  rear: 508,
  error: 0,
  choice: "difference",
  step: 0,
  read: 0,
  page: 10,
};
export const NEAR: State = { ...INITIAL, pole: 12, gap: 48, front: 40, rear: 56 };
export const record = (s: State): RecordQ => ({
  h: q(s.pole, 4),
  s: q(s.gap, 4),
  a: q(s.front, 4),
  b: q(s.rear, 4),
});
export const limits = {
  pole: [1, 400],
  gap: [1, 40000],
  front: [1, 8000],
  rear: [1, 8000],
  error: [0, 64],
} as const;
export function quarter(text: string, min: number, max: number): number | null {
  if (!/^(?:0|[1-9]\d{0,5})(?:\.(?:0|00|25|5|50|75))?$/.test(text)) return null;
  const value = Number(text) * 4;
  return Number.isInteger(value) && value >= min && value <= max ? value : null;
}
export function serialize(s: State): string {
  return new URLSearchParams(
    Object.entries(s).map(([k, v]) => [k, String(k in limits ? Number(v) / 4 : v)]),
  ).toString();
}
export function parse(search: string): { state: State; warning: string } {
  const params = new URLSearchParams(search);
  const s = { ...INITIAL };
  try {
    const seen = new Set<string>();
    for (const [key, raw] of params) {
      if (seen.has(key) || !Object.hasOwn(s, key)) throw new Error();
      seen.add(key);
      if (Object.hasOwn(limits, key)) {
        const field = key as keyof typeof limits;
        const [min, max] = limits[field];
        const value = quarter(raw, min, max);
        if (value === null) throw new Error();
        s[field] = value;
      } else if (key === "choice") {
        if (raw !== "difference" && raw !== "gap") throw new Error();
        s.choice = raw;
      } else {
        if (!/^\d{1,2}$/.test(raw)) throw new Error();
        const n = Number(raw);
        if (
          (key === "step" && n <= 6) ||
          (key === "read" && n <= 9) ||
          (key === "page" && n >= 9 && n <= 13)
        )
          s[key as "step" | "read" | "page"] = n;
        else throw new Error();
      }
    }
    return { state: s, warning: "" };
  } catch {
    return {
      state: { ...INITIAL },
      warning:
        "This address contains an invalid or repeated field. The complete source record has been restored; no partial record was used.",
    };
  }
}
