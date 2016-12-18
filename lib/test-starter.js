'use strict';
const {app} = require('electron');

app.on('ready', () => {
	const opts = JSON.parse(process.argv[2]);
	if (opts.renderer) {
		// TODO
		app.quit();
	} else {
		require('ava/lib/test-worker'); // eslint-disable-line import/no-unassigned-import
	}
});

