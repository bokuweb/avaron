import test from 'ava';

const add = (a, b) => a + b;

test('add test', async t => {
	t.is(add(1, 2), 3);
});
