'use strict';

const {BrowserWindow} = require('electron');
const url = require('url');
const path = require('path');

module.exports = (options, argv) => {
	const actualOptions = Object.assign({show: false, width: 800, height: 600}, options.windowOptions);
	const window = new BrowserWindow(actualOptions);
	const fixture = options.fixture ?
		path.resolve(process.cwd(), options.fixture) :
		path.resolve(__dirname, '../renderer/index.html');
	console.log(path.relative(__dirname, fixture))
	const windowURL = getURL(argv, path.relative(__dirname, fixture));
        console.log(windowURL)
	const rendererDir = path.relative(__dirname, path.resolve(__dirname, '../renderer'));
	const starter = options.fixture ?
		path.resolve(process.cwd(), path.relative(path.dirname(fixture), rendererDir) + '/starter.js') :
		'./starter.js';
	console.log(rendererDir)
	window.webContents.on('dom-ready', ( ) => {
		window.webContents.executeJavaScript(`
			document.body.style.backgroundColor = "#fff";
			require("${starter}");
		`);
	});
	// Window.webContents.openDevTools();
	window.loadURL(windowURL);
	return window;
};

function getURL(argv, fixture) {
	const unencodedHash = JSON.stringify(argv);
	const hash = encodeURIComponent(unencodedHash);
	return url.format({
		pathname: fixture,
		protocol: 'file',
		slashes: true,
		hash
	});
}
