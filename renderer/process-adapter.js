/*
Some of the code based on https://github.com/avajs/ava/blob/033d4dcdcbdadbf665c740ff450c2a775a8373dc/lib/test-worker.js

The MIT License (MIT)

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

'use strict';
const {ipcRenderer} = require('electron');
const serializeError = require('ava/lib/serialize-error');
const currentlyUnhandled = require('currently-unhandled')();
const processAdapter = require('ava/lib/process-adapter');

processAdapter.exit = window.close;

processAdapter.send = (name, data) => {
	ipcRenderer.send('ava-message', name, data);
};

ipcRenderer.on('ava-message', (event, name, data) => {
	processAdapter.emit(name, data);
});

const dependencies = [];
processAdapter.installDependencyTracking(dependencies, processAdapter.opts.file);

processAdapter.on('ava-exit', () => {
	// Use a little delay when running on AppVeyor (because it's shit)
	const delay = process.env.AVA_APPVEYOR ? 100 : 0;

	setTimeout(() => {
		processAdapter.exit(0); // eslint-disable-line xo/no-process-exit
	}, delay);
});

let tearingDown = false;
processAdapter.on('ava-teardown', () => {
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

	processAdapter.send('unhandledRejections', {rejections});
	setTimeout(exit, 100);
});

function exit() {
	// Include dependencies in the final teardown message. This ensures the full
	// set of dependencies is included no matter how the process exits, unless
	// it flat out crashes.
	processAdapter.send('teardown', {dependencies});
}
