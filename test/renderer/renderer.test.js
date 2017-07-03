
import test from 'ava';
import React from 'react';
import { render } from 'react-dom';
import { screenshot } from '../../renderer/test-helper';

test('react', async t => {
	render(<div>Hello, world</div>, document.body)
	document.body.style.backgroundColor = "#ccc";
	t.is(1, 1);
	await screenshot('hello_react.png');
});
