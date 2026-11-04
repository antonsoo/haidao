import assert from "node:assert/strict";
import { test } from "node:test";
import {
  bounds,
  candidate,
  errorWitness,
  exact,
  INITIAL,
  NEAR,
  parse,
  q,
  record,
  serialize,
  solve,
} from "../src/core/survey.ts";

test("the printed recipe and its two independent observations", () => {
  const r = record(INITIAL),
    m = solve(r);
  assert.equal(exact(m.delta), "4");
  assert.ok(m.difference);
  assert.ok(m.gap);
  assert.equal(exact(m.difference.height), "1255");
  assert.equal(exact(m.difference.distance), "30750");
  assert.equal(exact(m.difference.frontResidual), "0");
  assert.equal(exact(m.difference.rearResidual), "0");
  assert.equal(exact(m.gap.height), "10");
  assert.equal(exact(m.gap.distance), "123");
  assert.equal(exact(m.gap.frontResidual), "0");
  assert.equal(exact(m.gap.rearResidual), "-4980/127");
});
test("parallel, reversed, coincident divisors, and a nearby comparison stay distinct", () => {
  assert.equal(solve(record({ ...INITIAL, rear: INITIAL.front })).kind, "parallel");
  assert.equal(solve(record({ ...INITIAL, rear: INITIAL.front })).difference, null);
  assert.equal(solve(record({ ...INITIAL, rear: 400 })).kind, "behind");
  const r = record(NEAR);
  const answer = solve(r).difference;
  const coincident = candidate({ ...r, s: q(4) }, q(4));
  assert.ok(answer);
  assert.ok(coincident);
  assert.equal(exact(answer.height), "12");
  assert.equal(exact(answer.distance), "30");
  assert.equal(exact(coincident.rearResidual), "0");
});
test("setback intervals retain bounded, unbounded, impossible and invalid cases", () => {
  const r = record(INITIAL),
    b = bounds(r, q(1));
  assert.equal(b.kind, "bounded");
  if (b.kind !== "bounded") throw new Error();
  assert.equal(exact(b.lowH), "2515/3");
  assert.equal(exact(b.highH), "2505");
  assert.equal(exact(b.lowD), "61000/3");
  assert.equal(exact(b.highD), "62000");
  assert.equal(bounds(r, q(2)).kind, "unbounded");
  assert.equal(bounds(r, q(123)).kind, "invalid");
  assert.equal(bounds({ ...r, a: q(130), b: q(120) }, q(1)).kind, "none");
});
test("a share address round-trips exact quarter-bu, but never accepts a mixed invalid record", () => {
  const s = { ...NEAR, error: 5, step: 6, read: 9, page: 12 };
  assert.deepEqual(parse(serialize(s)).state, s);
  for (const search of [
    "front=123&front=124",
    "pole=0",
    "front=1.2",
    "rear=NaN",
    "step=-1",
    "page=14",
    "__proto__=x",
    "constructor=x",
    "choice=typo",
    "gap=1e3",
  ]) {
    const result = parse(search);
    assert.ok(result.warning);
    assert.deepEqual(result.state, INITIAL);
  }
});

test("a shared additive offset preserves height while shifting distance", () => {
  const r = record(INITIAL);
  const b = bounds(r, q(2), "shared");
  assert.equal(b.kind, "bounded");
  if (b.kind !== "bounded") throw new Error();
  assert.equal(exact(b.lowH), "1255");
  assert.equal(exact(b.highH), "1255");
  assert.equal(exact(b.lowD), "30250");
  assert.equal(exact(b.highD), "31250");
  assert.equal(exact(b.deltaLow), "4");
  assert.equal(exact(b.deltaHigh), "4");
  assert.equal(bounds({ ...r, b: r.a }, q(2), "shared").kind, "none");
  assert.equal(bounds({ ...r, b: q(120) }, q(2), "shared").kind, "none");
  assert.equal(bounds(r, q(123), "shared").kind, "invalid");
});
test("old addresses retain independent errors; new assumptions round-trip and reject malformed probes", () => {
  assert.equal(parse("error=2").state.errorMode, "independent");
  const state = { ...INITIAL, error: 8, probe: -99, errorMode: "shared" as const };
  assert.deepEqual(parse(serialize(state)).state, state);
  for (const search of [
    "probe=101",
    "probe=-101",
    "probe=1.5",
    "errorMode=scale",
    "probe=1&probe=2",
  ]) {
    assert.ok(parse(search).warning);
    assert.deepEqual(parse(search).state, INITIAL);
  }
});

test("opposing errors approach parallel rays; the common-offset trace stays finite", () => {
  const state = { ...INITIAL, error: 8, probe: 99, rearProbe: -99 };
  const w = errorWitness(state);
  assert.equal(exact(w.frontError), "99/50");
  assert.equal(exact(w.rearError), "-99/50");
  assert.ok(w.solution?.difference);
  assert.equal(exact(w.solution.difference.height), "125005");
  assert.equal(errorWitness({ ...state, probe: 100, rearProbe: -100 }).solution?.kind, "parallel");
  const shared = errorWitness({ ...state, probe: 100, errorMode: "shared" });
  assert.ok(shared.solution?.difference);
  assert.equal(exact(shared.solution.difference.height), "1255");
  assert.equal(
    errorWitness({ ...state, front: 4, errorMode: "shared", probe: -100 }).solution,
    null,
  );
});

test("independent errors select a two-dimensional pair without changing its complete bounds", () => {
  const s = { ...INITIAL, error: 8, probe: 100, rearProbe: 50 };
  const w = errorWitness(s);
  assert.equal(exact(w.frontError), "2");
  assert.equal(exact(w.rearError), "1");
  assert.ok(w.solution?.difference);
  assert.equal(exact(w.solution.difference.height), "5015/3");
  assert.equal(exact(w.solution.difference.distance), "125000/3");
  assert.equal(bounds(record(s), q(2), "independent").kind, "unbounded");
  const equal = errorWitness({ ...s, rearProbe: 100 });
  assert.ok(equal.solution?.difference);
  assert.equal(exact(equal.solution.difference.height), "1255");
  const linked = errorWitness({ ...s, errorMode: "shared" });
  assert.equal(exact(linked.rearError), "2");
});
test("old single-probe URLs preserve their opposing pair; explicit rear choices round-trip", () => {
  const legacy = parse("error=2&probe=99");
  assert.equal(legacy.warning, "");
  assert.equal(legacy.state.rearProbe, -99);
  assert.equal(exact(errorWitness(legacy.state).rearError), "-99/50");
  const chosen = { ...INITIAL, error: 8, probe: 37, rearProbe: -61 };
  assert.deepEqual(parse(serialize(chosen)).state, chosen);
  for (const search of [
    "rearProbe=101",
    "rearProbe=-101",
    "rearProbe=2.5",
    "rearProbe=0&rearProbe=1",
  ])
    assert.ok(parse(search).warning);
});
