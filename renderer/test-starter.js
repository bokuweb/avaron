'use strict';
const {ipcRenderer} = require('electron');
const serializeError = require('ava/lib/serialize-error');

// Setup as soon as possible
function onUncaughtException(err) {
	ipcRenderer.send('ava-message', 'uncaughtException', {
		exception: serializeError(err)
	});
}

process.on('uncaughtException', onUncaughtException);

function parseArgv() {
	const unencodedHash = decodeURIComponent(window.location.hash.substr(1));
	const argv = JSON.parse(unencodedHash);

	return argv;
}

process.argv = parseArgv();

require('./process-adapter'); // eslint-disable-line import/no-unassigned-import
require('./globals'); // eslint-disable-line import/no-unassigned-import
require('./console'); // eslint-disable-line import/no-unassigned-import

// Ensure the tests only run once
ipcRenderer.once('test-start', () => {
	require('ava/lib/test-worker'); // eslint-disable-line import/no-unassigned-import

	// Disable duplicate reporting
	process.removeListener('uncaughtException', onUncaughtException);
});
