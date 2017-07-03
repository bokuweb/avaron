#!/usr/bin/env node

'use strict';

// This file is based https://github.com/avajs/ava/blob/8c35a1a4b61c3f91d8c7b61e185dd5b450402bc0/lib/cli.js.
//
// https://github.com/avajs/ava/blob/master/license
//
// MIT License
// 
//  Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

const debug = require('debug')('ava');
const importLocal = require('import-local');

// Prefer the local installation of AVA
if (importLocal(__filename)) {
        debug('Using local install of AVA');
} else {
        if (debug.enabled) {
                require('time-require'); // eslint-disable-line import/no-unassigned-import
        }

        try {
                require('./lib/cli').run();
        } catch (err) {
                console.error(err)
                process.exit(1);
        }
}
