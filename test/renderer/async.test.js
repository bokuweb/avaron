
import test from 'ava';

test.serial('1 equals 1', async t => {
        window.a = 1;
        const add = () => new Promise((resolve) => {
                setTimeout(() => {
                        t.is(!!window.document.body, true);
                        t.is(window.a, 1);
                        resolve();
                }, 5000)
        })
        await add();
});


test.serial('1 equals 1', async t => {
        window.a = 2;
        const add = () => new Promise((resolve) => {
                setTimeout(() => {
                        t.is(!!window.document.body, true);
                        t.is(window.a, 2);
                        resolve();
                }, 3000)
        })
        await add();
});
