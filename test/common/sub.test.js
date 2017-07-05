
import test from 'ava';

test('1 equals 1', async t => {
	const add = () => new Promise(resolve => {
		setTimeout(() => {
			t.is(1, 1);
			resolve();
		}, 3000);
	});
	await add();
});
