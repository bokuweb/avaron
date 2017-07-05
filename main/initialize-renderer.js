/* eslint-disable import/no-unassigned-import */

'use strict';
const { ipcMain } = require('electron');
const createWindow = require('./create-window');
const messages = require('./messages');

require('./renderer-console');

module.exports = opts => {
	const window = createWindow(opts, process.argv);
	addRendererEventHandlers(window);
};

function addRendererEventHandlers(window) {
	ipcMain.on('ava-message', (event, name, data) => {
		messages.sendToProcess(name, data);
	});

	process.on('message', message => {
		if (!message.ava) {
			return;
		}
		messages.sendToWindow(window, message);
	});

	window.webContents.once('did-finish-load', () => {
		window.webContents.send('test-start');
	});
}
