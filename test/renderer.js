import {ipcMain, ipcRenderer} from 'electron';
import test from 'ava';

test('ipcRenderer is defined', t => {
	t.false(ipcRenderer == null);
});

test('ipcMain is not defined', t => {
	t.true(ipcMain == null);
});
