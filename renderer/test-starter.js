'use strict';
const {ipcRenderer} = require('electron');
const setupTestEnvironment = require('./setup-test-environment');

ipcRenderer.on('test-start', (event, argv) => {
	setupTestEnvironment(argv);

	require('ava/lib/test-worker'); // eslint-disable-line import/no-unassigned-import
});
