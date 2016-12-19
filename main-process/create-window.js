const {BrowserWindow} = require('electron');
const url = require('url');
const path = require('path');

module.exports = function (options) {
	const window = new BrowserWindow(options);
	const windowURL = getURL();

	window.loadURL(windowURL);

	return window;
};

function getURL() {
	return url.format({
		pathname: path.resolve(__dirname, '../renderer/index.html'),
		protocol: 'file',
		slashes: true
	});
}
