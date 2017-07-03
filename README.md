# AVARON

WIP

[![Build Status](https://travis-ci.org/bokuweb/avaron.svg?branch=master)](https://travis-ci.org/bokuweb/avaron)
[![Build status](https://ci.appveyor.com/api/projects/status/uegh5k030l8xb5nb/branch/master?svg=true)](https://ci.appveyor.com/project/bokuweb/avaron/branch/master)
   
   
AVARON forked from electron-ava.

## Usage

You can install `avaron` with the following command:

```sh
$ npm install avaron --save-dev
```

Or, if you prefer yarn:

```sh
$ yarn add avaron -D
```

Then add the following in your `package.json`:

```json
"scripts": {
	"test": "avaron"
}
```

That's all! You can now run your Electron tests in AVA using `yarn test` or `npm test`.

## Command line interface

```sh
  Usage
    avaron [<file|directory|glob> ...]

  Options
    --fail-fast             Stop after first test failure
    --serial, -s            Run tests serially
    --tap, -t               Generate TAP output
    --verbose, -v           Enable verbose output
    --no-cache              Disable the transpiler cache
    --no-power-assert       Disable Power Assert
    --match, -m             Only run tests with matching title (Can be repeated)
    --watch, -w             Re-run tests when tests and source files change
    --source, -S            Pattern to match source files so tests can be re-run (Can be repeated)
    --timeout, -T           Set global timeout
    --concurrency, -c       Maximum number of test files running at the same time (EXPERIMENTAL)
    --update-snapshots, -u  Update snapshots
    --renderer              Run the on the renderer process

  Examples
    avaron
    avaron test.js test2.js
    avaron test-*.js
    avaron test

  Default patterns when no arguments:
  test.js test-*.js test/**/*.js **/__tests__/**/*.js **/*.test.js
```

The CLI has the same options as the
[AVA CLI](https://github.com/avajs/ava/tree/033d4dcdcbdadbf665c740ff450c2a775a8373dc#cli),
except for the options `--init` and `--renderer`. `--init` has not yet been added and
`--renderer` has been added.

`--renderer` allows you to run the tests in the renderer process instead of the main process.

## Renderer process tests

If you want to run your tests in the renderer process, you can add the `renderer`
option to the `avaron` section in your `package.json` and give it the value `true`.
This config works the same as the [`ava` config](https://github.com/avajs/ava#configuration).

Your `package.json` then should look like this:

```json
{
	"scripts": {
		"test": "avaron"
	},
	"devDependencies": {
		"avaron": "^0.1.0"
	},
	"avaron": {
		"renderer": true
	}
}
```

## BrowserWindow options

If you want to pass options to the browser window for the renderer process, you can do this by
adding the `browserWindowOptions` option to your config. This object will then be passed to the
[`BrowserWindow` constructor](http://electron.atom.io/docs/api/browser-window/#new-browserwindowoptions).

For example, if you want to have with the title `My fancy tests`, you could update your `package.json`
to look like this:

```json
{
	"scripts": {
		"test": "avaron"
	},
	"devDependencies": {
		"avaron": "^0.1.0"
	},
	"avaron": {
		"renderer": true,
		"windowOptions": {
			"title": "My fancy tests"
		}
	}
}
```