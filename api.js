'use strict';

const util = require('util');
const fs = require('fs');
const Api = require('ava/api');
const fork = require('./lib/fork');

module.exports = class ElectronApi extends Api {

        _runFile(file, runStatus, execArgv) {
                const hash = this.precompiler.precompileFile(file);
                const precompiled = Object.assign({}, this._precompiledHelpers);
                const resolvedfpath = fs.realpathSync(file);
                precompiled[resolvedfpath] = hash;

                const options = Object.assign({}, this.options, { precompiled });
                const emitter = fork(file, options, execArgv);
                runStatus.observeFork(emitter);

                return emitter;
        }
}
