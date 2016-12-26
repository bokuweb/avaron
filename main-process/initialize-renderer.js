'use strict';
const {ipcMain} = require('electron');
const createWindow = require('./create-window');
const avaMessages = require('./ava-messages');

module.exports = opts => {
	const window = createWindow(opts.windowOptions, process.argv);

	addRendererEventHandlers(window);
};

function addRendererEventHandlers(window) {
	ipcMain.on('ava-message', (event, name, data) => {
		avaMessages.sendToProcess(name, data);
	});

	process.on('message', message => {
		if (!message.ava) {
			return;
		}

		avaMessages.sendToWindow(window, message);
	});

	window.webContents.once('did-finish-load', () => {
		startRendererTests(window);
	});

	require('./renderer-console'); // eslint-disable-line import/no-unassigned-import
}

function startRendererTests(window) {
	window.webContents.send('test-start');
}
