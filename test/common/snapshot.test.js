import test from 'ava';
import React from 'react';
import render from 'react-test-renderer';

const HelloWorld = () => <h1>Hello World.....!</h1>;

test('HelloWorld component', t => {
	const tree = render.create(<HelloWorld />).toJSON();
	t.snapshot(tree);
});
