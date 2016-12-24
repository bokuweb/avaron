const {BrowserWindow} = require('electron');
const url = require('url');
const path = require('path');

module.exports = function (options, argv) {
	const window = new BrowserWindow(options);
	const windowURL = getURL(argv);

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
