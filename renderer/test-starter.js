'use strict';
const {ipcRenderer} = require('electron');
require('./globals'); // eslint-disable-line import/no-unassigned-import

ipcRenderer.on('test-start', (event, argv) => {
	process.argv = argv;
	require('./process-adapter'); // eslint-disable-line import/no-unassigned-import

	require('ava/lib/test-worker'); // eslint-disable-line import/no-unassigned-import
});
