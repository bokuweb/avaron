import {ipcMain} from 'electron';
import test from 'ava';

test('it works', t => {
	t.not(ipcMain, undefined);
	t.not(ipcMain, null);
});
