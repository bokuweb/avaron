import {ipcRenderer} from 'electron';
import test from 'ava';

test('it works', t => {
	t.not(ipcRenderer, undefined);
	t.not(ipcRenderer, null);
});
