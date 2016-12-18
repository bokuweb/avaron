/*
Based on https://github.com/avajs/ava/blob/033d4dcdcbdadbf665c740ff450c2a775a8373dc/api.js

The MIT License (MIT)

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

'use strict';
var util = require('util');
var fs = require('fs');
var objectAssign = require('object-assign');
var Api = require('ava/api');
var fork = require('./fork');

function ElectronApi(options) {
	Api.call(this, options);
}

util.inherits(ElectronApi, Api);
module.exports = ElectronApi;

ElectronApi.prototype._runFile = function (file, runStatus, execArgv) {
	var hash = this.precompiler.precompileFile(file);
	var precompiled = {};
	var resolvedfpath = fs.realpathSync(file);
	precompiled[resolvedfpath] = hash;

	var options = objectAssign({}, this.options, {
		precompiled: precompiled
	});

	var emitter = fork(file, options, execArgv);
	runStatus.observeFork(emitter);

	return emitter;
};
