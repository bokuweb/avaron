'use strict';

/* eslint-disable import/no-unassigned-import */

const {ipcRenderer} = require('electron');
const serializeError = require('ava/lib/serialize-error');

window.__avaron__ = true;

// Below code is stub for ava process.send.
process.send = () => { };

// Below code is stub for Node.js process.channel or process._channel.
process.channel = {
	unref() { },
	ref() { }
};

function onUncaughtException(err) {
	ipcRenderer.send('ava-message', 'uncaughtException', {
		exception: serializeError(err)
	});
}

process.on('uncaughtException', onUncaughtException);

function parseArgv() {
	const unencodedHash = decodeURIComponent(window.location.hash.substr(1));
	return JSON.parse(unencodedHash);
}

process.argv = parseArgv();

require('./console');
require('./process-adapter');

// Ensure the tests only run once
ipcRenderer.once('test-start', () => {
	require('ava/lib/test-worker');
	// Disable duplicate reporting
	process.removeListener('uncaughtException', onUncaughtException);
});
