import test from "ava";

const sub = (a, b) => a - b;

test("sub test", async t => {
  t.is(sub(2, 1), 1);
  t.is(!!document, true)
});
