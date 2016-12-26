'use strict';
const {ipcMain} = require('electron');

const listenToOutput = (channel, outputMethod) => {
	ipcMain.on(channel, (event, output) => {
		outputMethod(output);
	});
};

listenToOutput('console-log', console.log);
listenToOutput('console-warn', console.warn);
listenToOutput('console-error', console.error);
