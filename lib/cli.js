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

'use strict';
const path = require('path');
const updateNotifier = require('update-notifier');
const figures = require('figures');
const arrify = require('arrify');
const meow = require('meow');
const Promise = require('bluebird');
const pkgConf = require('pkg-conf');
const isCi = require('is-ci');
const hasFlag = require('has-flag');
const Api = require('../api');
const colors = require('ava/lib/colors');
const VerboseReporter = require('ava/lib/reporters/verbose');
const MiniReporter = require('ava/lib/reporters/mini');
const TapReporter = require('ava/lib/reporters/tap');
const Logger = require('ava/lib/logger');
const Watcher = require('ava/lib/watcher');
const babelConfigHelper = require('ava/lib/babel-config');

// Bluebird specific
Promise.longStackTraces();

exports.run = () => {
        const conf = pkgConf.sync('ava');

        const filepath = pkgConf.filepath(conf);
        const projectDir = filepath === null ? process.cwd() : path.dirname(filepath);

        const cli = meow(`
		Usage
		  ava [<file|directory|glob> ...]
		Options
		  --init                  Add AVA to your project
		  --fail-fast             Stop after first test failure
		  --serial, -s            Run tests serially
		  --tap, -t               Generate TAP output
		  --verbose, -v           Enable verbose output
		  --no-cache              Disable the transpiler cache
		  --no-power-assert       Disable Power Assert
		  --color                 Force color output
		  --no-color              Disable color output
		  --match, -m             Only run tests with matching title (Can be repeated)
		  --watch, -w             Re-run tests when tests and source files change
		  --timeout, -T           Set global timeout
		  --concurrency, -c       Maximum number of test files running at the same time (EXPERIMENTAL)
		  --update-snapshots, -u  Update snapshots
    		  --renderer              Run test on electron renderer
		Examples
		  ava
		  ava test.js test2.js
		  ava test-*.js
		  ava test
		  ava --init
		  ava --init foo.js
		Default patterns when no arguments:
		test.js test-*.js test/**/*.js **/__tests__/**/*.js **/*.test.js
	`, {
                        string: [
                                '_',
                                'match',
                                'timeout',
                                'concurrency'
                        ],
                        boolean: [
                                'init',
                                'fail-fast',
                                'serial',
                                'tap',
                                'verbose',
                                'watch',
                                'update-snapshots',
                                'color',
                                'renderer',
                        ],
                        default: {
                                cache: conf.cache,
                                color: 'color' in conf ? conf.color : require('supports-color') !== false,
                                concurrency: conf.concurrency,
                                failFast: conf.failFast,
                                init: conf.init,
                                match: conf.match,
                                powerAssert: conf.powerAssert,
                                serial: conf.serial,
                                tap: conf.tap,
                                timeout: conf.timeout,
                                updateSnapshots: conf.updateSnapshots,
                                verbose: conf.verbose,
                                watch: conf.watch
                        },
                        alias: {
                                t: 'tap',
                                v: 'verbose',
                                s: 'serial',
                                m: 'match',
                                w: 'watch',
                                T: 'timeout',
                                c: 'concurrency',
                                u: 'update-snapshots'
                        }
                });

        updateNotifier({ pkg: cli.pkg }).notify();

        if (cli.flags.init) {
                require('ava-init')();
                return;
        }

        if (
                ((hasFlag('--watch') || hasFlag('-w')) && (hasFlag('--tap') || hasFlag('-t'))) ||
                (conf.watch && conf.tap)
        ) {
                throw new Error(colors.error(figures.cross) + ' The TAP reporter is not available when using watch mode.');
        }

        if ((hasFlag('--watch') || hasFlag('-w')) && isCi) {
                throw new Error(colors.error(figures.cross) + ' Watch mode is not available in CI, as it prevents AVA from terminating.');
        }

        if (cli.flags.concurrency === '') {
                throw new Error(colors.error(figures.cross) + ' The --concurrency and -c flags must be provided the maximum number of test files to run at once.');
        }

        if (hasFlag('--require') || hasFlag('-r')) {
                throw new Error(colors.error(figures.cross) + ' The --require and -r flags are deprecated. Requirements should be configured in package.json - see documentation.');
        }

        // Copy resultant cli.flags into conf for use with Api and elsewhere
        Object.assign(conf, cli.flags);

        const api = new Api({
                failFast: conf.failFast,
                failWithoutAssertions: conf.failWithoutAssertions !== false,
                serial: conf.serial,
                require: arrify(conf.require),
                cacheEnabled: conf.cache !== false,
                powerAssert: conf.powerAssert !== false,
                explicitTitles: conf.watch,
                match: arrify(conf.match),
                babelConfig: babelConfigHelper.validate(conf.babel),
                resolveTestsFrom: cli.input.length === 0 ? projectDir : process.cwd(),
                projectDir,
                timeout: conf.timeout,
                concurrency: conf.concurrency ? parseInt(conf.concurrency, 10) : 0,
                updateSnapshots: conf.updateSnapshots,
                color: conf.color,
                renderer: cli.flags.renderer,
        });

        let reporter;

        if (conf.tap && !conf.watch) {
                reporter = new TapReporter();
        } else if (conf.verbose || isCi) {
                reporter = new VerboseReporter({ color: conf.color });
        } else {
                reporter = new MiniReporter({ color: conf.color, watching: conf.watch });
        }

        reporter.api = api;
        const logger = new Logger(reporter);

        logger.start();

        api.on('test-run', runStatus => {
                reporter.api = runStatus;
                runStatus.on('test', logger.test);
                runStatus.on('error', logger.unhandledError);

                runStatus.on('stdout', logger.stdout);
                runStatus.on('stderr', logger.stderr);
        });

        const files = cli.input.length ? cli.input : arrify(conf.files);

        if (conf.watch) {
                try {
                        const watcher = new Watcher(logger, api, files, arrify(conf.source));
                        watcher.observeStdin(process.stdin);
                } catch (err) {
                        if (err.name === 'AvaError') {
                                // An AvaError may be thrown if `chokidar` is not installed. Log it nicely.
                                console.error(`  ${colors.error(figures.cross)} ${err.message}`);
                                logger.exit(1);
                        } else {
                                // Rethrow so it becomes an uncaught exception
                                throw err;
                        }
                }
        } else {
                api.run(files)
                        .then(runStatus => {
                                logger.finish(runStatus);
                                logger.exit(runStatus.failCount > 0 || runStatus.rejectionCount > 0 || runStatus.exceptionCount > 0 ? 1 : 0);
                        })
                        .catch(err => {
                                // Don't swallow exceptions. Note that any expected error should already
                                // have been logged.
                                setImmediate(() => {
                                        throw err;
                                });
                        });
        }
};