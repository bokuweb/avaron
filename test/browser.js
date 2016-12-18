import {ipcMain, ipcRenderer} from 'electron';
import test from 'ava';

test('ipcMain is defined', t => {
	t.false(ipcMain == null);
});

test('ipcRenderer is not defined', t => {
	t.true(ipcRenderer == null);
});
