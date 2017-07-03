module.exports = {
	isAvaron: function () {
		return !!window.__avaron__;
	},
	getCurrentWindow: function () {
		if (!window.__avaron__) {
			if (!window.__avaron__) {
				return null;
			}
			const { remote } = require('electron')
			return remote.getCurrentWindow();
		}
	},
	screenshot: function (imagePath) {
		return new Promise(function (resolve, reject) {
			if (!window.__avaron__) {
				return resolve();
			}
			const fs = require('fs');
			const { remote } = require('electron');
			const mkdirp = require('make-dir');
			const path = require('path');
			const win = remote.getCurrentWindow();
			requestIdleCallback(function () {
				win.capturePage(function (img) {
					const size = img.getSize();
					const ratio = window.devicePixelRatio;
					const png = img.resize({ width: size.width / ratio, height: size.height / ratio }).toDataURL();
					const data = png.split(',')[1];
					mkdirp(path.dirname(imagePath))
						.then(() => {
							fs.writeFile(imagePath, data, 'base64', resolve);
						})
						.catch((err) => {
							reject(err);
						});
				});
			}, { timeout: 1000 });
		});
	},
};