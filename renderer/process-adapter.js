'use strict';
const { ipcRenderer } = require('electron');
const serializeError = require('ava/lib/serialize-error');
const currentlyUnhandled = require('currently-unhandled')();
const processAdapter = require('ava/lib/process-adapter');
const { setRunner } = require('ava/lib/test-worker');

let tearingDown = false;

processAdapter.exit = window.close;

processAdapter.send = (name, data) => {
	ipcRenderer.send('ava-message', name, data);
};

processAdapter.installSourceMapSupport();
processAdapter.installPrecompilerHook();

const dependencies = new Set();
processAdapter.installDependencyTracking(dependencies, processAdapter.opts.file);

const touchedFiles = new Set();

const exit = () => {
	// Include dependencies in the final teardown message. This ensures the full
	// set of dependencies is included no matter how the process exits, unless
	// it flat out crashes.
	processAdapter.send('teardown',
		{
			dependencies: Array.from(dependencies),
			touchedFiles: Array.from(touchedFiles),
		});
};

const avaExit = () => {
	// Use a little delay when running on AppVeyor (because it's shit)
	const delay = process.env.AVA_APPVEYOR ? 100 : 0;

	setTimeout(() => {
		processAdapter.exit(0); // eslint-disable-line xo/no-process-exit
	}, delay);
	return;
};

const teardown = () => {
	// AVA-teardown can be sent more than once
	if (tearingDown) {
		return;
	}
	tearingDown = true;

	let rejections = currentlyUnhandled();

	if (rejections.length === 0) {
		exit();
		return;
	}

	rejections = rejections.map(rejection => {
		return serializeError(rejection.reason);
	});

	processAdapter.send('unhandledRejections', { rejections });
	setTimeout(exit, 100);
	return;
};

ipcRenderer.on('ava-message', (event, name, data) => {
	switch (name) {
		case 'ava-teardown': return teardown();
		case 'ava-exit': return avaExit();
	}
	process.emit(name, data);
});


