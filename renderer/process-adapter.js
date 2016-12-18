const {ipcRenderer, remote} = require('electron');
const processAdapter = require('ava/lib/process-adapter');

processAdapter.exit = remote.app.exit.bind(remote.app);

processAdapter.send = (name, data) => {
	ipcRenderer.send('ava-message', name, data);
};

ipcRenderer.on('ava-message', (event, name, data) => {
	processAdapter.emit(name, data);
});

module.exports = processAdapter;
