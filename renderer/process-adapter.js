/* eslint-disable import/no-extraneous-dependencies */

'use strict';
const { ipcRenderer } = require('electron');
const serializeError = require('ava/lib/serialize-error');
const currentlyUnhandled = require('currently-unhandled')();
const processAdapter = require('ava/lib/process-adapter');

let tearingDown = false;

processAdapter.exit = window.close;

processAdapter.send = (name, data) => {
	ipcRenderer.send('ava-message', name, data);
};

const dependencies = new Set();
processAdapter.installDependencyTracking(dependencies, processAdapter.opts.file);


const exit = () => {
	// Include dependencies in the final teardown message. This ensures the full
	// set of dependencies is included no matter how the process exits, unless
	// it flat out crashes.
	processAdapter.send('teardown',
		{
			dependencies: Array.from(dependencies),
		});
};

const teardown = () => {
	// AVA-teardown can be sent more than once
	if (tearingDown) {
		return;
	}
	tearingDown = true;

	let rejections = currentlyUnhandled();

	if (rejections.length > 0) {
		rejections = rejections.map(rejection => {
			let reason = rejection.reason;
			if (!isObj(reason) || typeof reason.message !== 'string') {
				reason = {
					message: String(reason)
				};
			}
			return serializeError(reason);
		});
		adapter.send('unhandledRejections', { rejections });
	}
	processAdapter.send('teardown', { dependencies: Array.from(dependencies) });
};

ipcRenderer.on('ava-message', (event, name, data) => {
	switch (name) {
		case 'ava-teardown': return teardown();
		case 'ava-exit': return processAdapter.exit(0); // eslint-disable-line xo/no-process-exit;
		default: return process.emit(name, data);
	}
});
