import { bounds, errorWitness, INITIAL, NEAR, q, record, solve } from "../src/core/survey.ts";

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
const pairs = [
  [-100, -100],
  [-100, 0],
  [-100, 100],
  [0, -100],
  [0, 0],
  [0, 100],
  [100, -100],
  [100, 0],
  [100, 100],
  [99, -99],
  [37, -61],
  [-43, 79],
  [99, 99],
] as const;
for (const state of states) {
  const r = record(state);
  process.stdout.write(
    `${JSON.stringify(
      {
        state,
        solution: solve(r),
        bounds: bounds(r, q(state.error, 4)),
        shared: bounds(r, q(state.error, 4), "shared"),
        witnesses: [
          ...pairs.map(([probe, rearProbe]) => ({
            probe,
            rearProbe,
            errorMode: "independent",
            ...errorWitness({
              ...state,
              probe: probe ?? 0,
              rearProbe: rearProbe ?? 0,
              errorMode: "independent",
            }),
          })),
          ...[-100, -99, -1, 0, 1, 99, 100].map((probe) => ({
            probe,
            rearProbe: 37,
            errorMode: "shared",
            ...errorWitness({ ...state, probe, rearProbe: 37, errorMode: "shared" }),
          })),
        ],
      },
      (_key, value) => (typeof value === "bigint" ? String(value) : value),
    )}\n`,
  );
}
