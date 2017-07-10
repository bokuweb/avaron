
import test from 'ava';
import { BrowserWindow } from 'electron';

test('should create browserWindow', async t => {
    const window = new BrowserWindow({});
    t.is(!!window, true);
});
