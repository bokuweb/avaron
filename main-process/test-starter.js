'use strict';
const {app, ipcMain} = require('electron');
const createWindow = require('./create-window');

app.on('ready', () => {
	const opts = JSON.parse(process.argv[2]);
	if (opts.renderer) {
		const window = createWindow(opts.windowOptions);

		ipcMain.on('ava-message', (event, name, data) => {
			process.send({
				name: `ava-${name}`,
				data,
				ava: true
			});
		});

		process.on('message', message => {
			if (!message.ava) {
				return;
			}

			window.webContents.send('ava-message', message.name, message.data);
		});

		window.webContents.once('did-finish-load', () => {
			window.webContents.send('test-start', process.argv);
		});
	} else {
		require('ava/lib/test-worker'); // eslint-disable-line import/no-unassigned-import
	}
});
