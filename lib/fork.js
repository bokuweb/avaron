// This file is based https://raw.githubusercontent.com/avajs/ava/314ef001ab1c085e2057738e2d2588bde3e792cc/lib/fork.js.
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

/* eslint-disable import/no-unassigned-import */
/* eslint-disable import/no-extraneous-dependencies */

/*
'use strict';
const childProcess = require('child_process');
const path = require('path');
const fs = require('fs');
const Promise = require('bluebird');
const debug = require('debug')('ava');
const AvaError = require('ava/lib/ava-error');

if (fs.realpathSync(__filename) !== __filename) {
	console.warn('WARNING: `npm link ava` and the `--preserve-symlink` flag are incompatible. We have detected that AVA is linked via `npm link`, and that you are using either an early version of Node 6, or the `--preserve-symlink` flag. This breaks AVA. You should upgrade to Node 6.2.0+, avoid the `--preserve-symlink` flag, or avoid using `npm link ava`.');
}

let env = process.env;

// Ensure NODE_PATH paths are absolute
if (env.NODE_PATH) {
	env = Object.assign({}, env);

	env.NODE_PATH = env.NODE_PATH
		.split(path.delimiter)
		.map(x => path.resolve(x))
		.join(path.delimiter);
}

// In case the test file imports a different AVA install,
// the presence of this variable allows it to require this one instead
env.AVA_PATH = path.resolve(require.resolve('ava'), '..');

module.exports = (file, opts, execArgv) => {
	opts = Object.assign({
		file,
		baseDir: process.cwd(),
		tty: process.stdout.isTTY ? {
			columns: process.stdout.columns,
			rows: process.stdout.rows
		} : false
	}, opts);

	// Const args = [JSON.stringify(opts), opts.color ? '--color' : '--no-color'];

	// Modified for ava-ron
	const ps = childProcess.spawn(require('electron'), [require.resolve('../main/starter'), JSON.stringify(opts)], {
		stdio: [null, null, null, 'ipc'],
		cwd: opts.projectDir,
		silent: false,
		env,
		execArgv: execArgv || process.execArgv
	});
	*/

"use strict";
const childProcess = require("child_process");
const path = require("path");
const fs = require("fs");
const Promise = require("bluebird");
const Emittery = require("ava/lib/emittery");

if (fs.realpathSync(__filename) !== __filename) {
  console.warn(
    "WARNING: `npm link ava` and the `--preserve-symlink` flag are incompatible. We have detected that AVA is linked via `npm link`, and that you are using either an early version of Node 6, or the `--preserve-symlink` flag. This breaks AVA. You should upgrade to Node 6.2.0+, avoid the `--preserve-symlink` flag, or avoid using `npm link ava`."
  );
}

const env = Object.assign({ NODE_ENV: "test" }, process.env);

// Ensure NODE_PATH paths are absolute
if (env.NODE_PATH) {
  env.NODE_PATH = env.NODE_PATH.split(path.delimiter)
    .map(x => path.resolve(x))
    .join(path.delimiter);
}

// In case the test file imports a different AVA install,
// the presence of this variable allows it to require this one instead
env.AVA_PATH = path.resolve(__dirname, "..");

const describeTTY = tty => ({
  colorDepth: tty.getColorDepth ? tty.getColorDepth() : undefined,
  columns: tty.columns || 80,
  rows: tty.rows
});

const workerPath = require.resolve("ava/lib/worker/subprocess");

module.exports = (file, opts, execArgv) => {
  let finished = false;

  const emitter = new Emittery();
  const emitStateChange = evt => {
    if (!finished) {
      emitter.emit("stateChange", Object.assign(evt, { testFile: file }));
    }
  };

  opts = Object.assign(
    {
      file,
      baseDir: process.cwd(),
      tty: {
        stderr: process.stderr.isTTY ? describeTTY(process.stderr) : false,
        stdout: process.stdout.isTTY ? describeTTY(process.stdout) : false
      }
    },
    opts
  );

  const args = [
    JSON.stringify(opts),
    opts.color ? "--color" : "--no-color"
  ].concat(opts.workerArgv);

  // const subprocess = childProcess.fork(workerPath, args, {
  //   cwd: opts.projectDir,
  //   silent: true,
  //   env,
  //   execArgv: execArgv || process.execArgv
  // });

  // Modified for ava-ron
  const subprocess = childProcess.spawn(
    require("electron"),
    [require.resolve("../main/starter"), JSON.stringify(opts)],
    {
      stdio: [null, null, null, "ipc"],
      cwd: opts.projectDir,
      silent: false,
      env,
      execArgv: execArgv || process.execArgv
    }
  );

  subprocess.stdout.on("data", chunk => {
    emitStateChange({ type: "worker-stdout", chunk });
  });

  subprocess.stderr.on("data", chunk => {
    emitStateChange({ type: "worker-stderr", chunk });
  });

  let forcedExit = false;
  const send = evt => {
    if (subprocess.connected && !finished && !forcedExit) {
      subprocess.send({ ava: evt });
    }
  };

  const promise = new Promise(resolve => {
    const finish = () => {
      finished = true;
      resolve();
    };

    subprocess.on("message", message => {
      if (!message.ava) {
        return;
      }

      if (message.ava.type === "ping") {
        send({ type: "pong" });
      } else {
        emitStateChange(message.ava);
      }
    });

    subprocess.on("error", err => {
      emitStateChange({ type: "worker-failed", err });
      finish();
    });

    subprocess.on("exit", (code, signal) => {
      if (forcedExit) {
        emitStateChange({ type: "worker-finished", forcedExit });
      } else if (code > 0) {
        emitStateChange({ type: "worker-failed", nonZeroExitCode: code });
      } else if (code === null && signal) {
        emitStateChange({ type: "worker-failed", signal });
      } else {
        emitStateChange({ type: "worker-finished", forcedExit });
      }

      finish();
    });
  });

  return {
    exit() {
      forcedExit = true;
      subprocess.kill();
    },

    notifyOfPeerFailure() {
      send({ type: "peer-failed" });
    },

    onStateChange(listener) {
      return emitter.on("stateChange", listener);
    },

    file,
    promise
  };
};
