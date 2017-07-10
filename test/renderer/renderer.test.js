
import test from 'ava';
import React from 'react';
import { readFileSync } from 'fs';
import { render } from 'react-dom';
import { screenshot, isAvaron, getCurrentWindow } from '../../';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn,
} from 'material-ui/Table';

/**
 * A simple table demonstrating the hierarchy of the `Table` component and its sub-components.
 */
const TableExampleSimple = () => (
	<MuiThemeProvider>
		<Table>
			<TableHeader>
				<TableRow>
					<TableHeaderColumn>ID</TableHeaderColumn>
					<TableHeaderColumn>Name</TableHeaderColumn>
					<TableHeaderColumn>Status</TableHeaderColumn>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow>
					<TableRowColumn>1</TableRowColumn>
					<TableRowColumn>John Smith</TableRowColumn>
					<TableRowColumn>Employed</TableRowColumn>
				</TableRow>
				<TableRow>
					<TableRowColumn>2</TableRowColumn>
					<TableRowColumn>Randal White</TableRowColumn>
					<TableRowColumn>Unemployed</TableRowColumn>
				</TableRow>
				<TableRow>
					<TableRowColumn>3</TableRowColumn>
					<TableRowColumn>Stephanie Sanders</TableRowColumn>
					<TableRowColumn>Employed</TableRowColumn>
				</TableRow>
				<TableRow>
					<TableRowColumn>4</TableRowColumn>
					<TableRowColumn>Steve Brown</TableRowColumn>
					<TableRowColumn>Employed</TableRowColumn>
				</TableRow>
				<TableRow>
					<TableRowColumn>5</TableRowColumn>
					<TableRowColumn>Christopher Nolan</TableRowColumn>
					<TableRowColumn>Unemployed</TableRowColumn>
				</TableRow>
			</TableBody>
		</Table>
	</MuiThemeProvider>
);

test('should capture react component screenshot', async t => {
	render(<TableExampleSimple />, document.querySelector('.main'));
	const path = 'screenshots/should_capture_react_component_screenshot.png';
	await screenshot(path);
	try {
		const png = readFileSync(path);
		t.is(!!png, true);
	} catch (e) {
		console.error(e);
		t.fail();
	}
});

test('should isAvaron return true', async t => {
	t.is(Boolean(isAvaron()), true);
});

test('should get currentWindow', async t => {
	const win = getCurrentWindow();
	t.is(Boolean(getCurrentWindow()), true);
});
