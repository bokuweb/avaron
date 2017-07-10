import test from 'ava';
import React from 'react';
import render from 'react-test-renderer';

const HelloWorld = () => <h1>Hello World.....!</h1>;
const HelloReact = (props) => <div><HelloWorld />{props.children}</div>;

test('HelloWorld component', t => {
	const tree = render.create(<HelloReact><HelloWorld /></HelloReact>).toJSON();
	t.snapshot(tree);
});
