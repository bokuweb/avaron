# Electron-AVA
[![CircleCI](https://circleci.com/gh/vdbwouter/electron-ava/tree/master.svg?style=svg)](https://circleci.com/gh/vdbwouter/electron-ava/tree/master)

All the simpleness of [AVA](https://ava.li) tests for [Electron](http://electron.atom.io).

## Usage

If you are already using `ava`, you can just replace `ava` with `electron-ava`
in your `package.json` (assuming all your tests run in the main process. If
not, see [renderer tests](#renderer-process-tests)).

Otherwise, you can install `electron-ava` with the following command:

```sh
$ npm install electron-ava --save-dev
```

Or, if you prefer yarn:

```sh
$ yarn add electron-ava -D
```

Then add the following in your `package.json`:

```json
"scripts": {
	"test": "electron-ava"
}
```

It should now look a bit like this:

```json
{
	"scripts": {
		"test": "electron-ava"
	},
	"devDependencies": {
		"electron-ava": "^0.1.0"
	}
}
```

That's all! You can now run your Electron tests in AVA using `yarn test` or `npm test`.

## Command line interface

```sh
  Usage
    electron-ava [<file|directory|glob> ...]

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
    --renderer              Run the tests in the renderer process

  Examples
    electron-ava
    electron-ava test.js test2.js
    electron-ava test-*.js
    electron-ava test

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
option to the `electron-ava` section in your `package.json` and give it the value `true`.
This config works the same as the [`ava` config](https://github.com/avajs/ava#configuration).

Your `package.json` then should look like this:

```json
{
	"scripts": {
		"test": "electron-ava"
	},
	"devDependencies": {
		"electron-ava": "^0.1.0"
	},
	"electron-ava": {
		"renderer": true
	}
}
```

## Window options

If you want to pass options to the browser window for the renderer process, you can do this by
adding the `windowOptions` option to your config. This object will then be passed to the
[`BrowserWindow` constructor](http://electron.atom.io/docs/api/browser-window/#new-browserwindowoptions).

For example, if you want to have with the title `My fancy tests`, you could update your `package.json`
to look like this:

```json
{
	"scripts": {
		"test": "electron-ava"
	},
	"devDependencies": {
		"electron-ava": "^0.1.0"
	},
	"electron-ava": {
		"renderer": true,
		"windowOptions": {
			"title": "My fancy tests"
		}
	}
}
```
