'use strict';
const util = require('util');
const {ipcRenderer} = require('electron');

const createOutput = channel => (format, ...args) => {
	const output = util.format(format, ...args);

	ipcRenderer.send(channel, output);
};

console.log = createOutput('console-log');
console.warn = createOutput('console-warn');
console.error = createOutput('console-error');
