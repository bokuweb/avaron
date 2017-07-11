
import test from 'ava';
import { BrowserWindow } from 'electron';
import { isAvaronRenderer } from '../../';

test('should create browserWindow', async t => {
    const window = new BrowserWindow({});
    t.is(!!window, true);
});

test('should isAvaronRenderer return false', async t => {
	t.is(Boolean(isAvaronRenderer()), false);
});
