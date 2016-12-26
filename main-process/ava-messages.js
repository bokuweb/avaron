function sendMessageToProcess(name, data) {
	process.send({
		name: `ava-${name}`,
		data,
		ava: true
	});
}

function sendMessageToWindow(window, message) {
	window.webContents.send('ava-message', message.name, message.data);
}

module.exports = {
	sendToProcess: sendMessageToProcess,
	sendToWindow: sendMessageToWindow
};
