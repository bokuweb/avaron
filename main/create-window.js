'use strict';

const { BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');

module.exports = (options, argv) => {
	console.log(options)
	const actualOptions = Object.assign({ show: true, width: 800, height: 600, webPreferences: { devTools: true } }, options);
	const window = new BrowserWindow(actualOptions);
	const windowURL = getURL(argv);
	window.webContents.on('dom-ready', (e) => {
		window.webContents.executeJavaScript('require("./starter.js");');
	});
	window.webContents.openDevTools();
	window.loadURL(windowURL);
	return window;
};

function getURL(argv) {
	const unencodedHash = JSON.stringify(argv);
	const hash = encodeURIComponent(unencodedHash);
	return url.format({
		pathname: path.resolve(__dirname, '../renderer/index.html'),
		protocol: 'file',
		slashes: true,
		hash
	});
}
