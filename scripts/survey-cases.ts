import { bounds, INITIAL, NEAR, q, record, solve } from "../src/core/survey.ts";

let seed = 0x51a7;
function random(max: number) {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return 1 + (seed % max);
}
const states = [
  INITIAL,
  NEAR,
  { ...INITIAL, rear: INITIAL.front },
  { ...INITIAL, rear: 400 },
  { ...NEAR, gap: 16 },
];
for (let i = 0; i < 3000; i++)
  states.push({
    ...INITIAL,
    pole: random(400),
    gap: random(40000),
    front: random(8000),
    rear: random(8000),
    error: random(65) - 1,
  });
for (const state of states) {
  const r = record(state);
  process.stdout.write(
    `${JSON.stringify({ state, solution: solve(r), bounds: bounds(r, q(state.error, 4)) }, (_key, value) => (typeof value === "bigint" ? String(value) : value))}\n`,
  );
}
