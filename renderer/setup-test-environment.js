const {ipcRenderer} = require('electron');
const globals = require('ava/lib/globals');

function setupProcess(argv) {
	process.argv = argv;

	const processAdapter = require('ava/lib/process-adapter');

	processAdapter.exit = window.close;

	processAdapter.send = (name, data) => {
		ipcRenderer.send('ava-message', name, data);
	};

	ipcRenderer.on('ava-message', (event, name, data) => {
		processAdapter.emit(name, data);
	});
}

function fixGlobals() {
	globals.setTimeout = setTimeout.bind(undefined);
	globals.clearTimeout = clearTimeout.bind(undefined);
	globals.setImmediate = setImmediate.bind(undefined);
}

module.exports = function (argv) {
	fixGlobals();
	setupProcess(argv);
};
