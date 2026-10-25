import assert from "node:assert/strict";
import { test } from "node:test";
import {
  bounds,
  candidate,
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
