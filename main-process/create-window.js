const {BrowserWindow} = require('electron');
const url = require('url');
const path = require('path');

module.exports = function (options) {
	const windowOptions = Object.assign({
		show: false
	}, options);

	const window = new BrowserWindow(windowOptions);
	const windowURL = getURL();

	window.loadURL(windowURL);

	window.once('ready-to-show', () => {
		window.show();
	});

	return window;
};

function getURL() {
	return url.format({
		pathname: path.resolve(__dirname, '../renderer/index.html'),
		protocol: 'file',
		slashes: true
	});
}
