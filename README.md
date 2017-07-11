# 🚀  Avaron 🚀 

🚀 AVA + Electron = Avaron 🚀   
Run your test on real browser with AVA.

[![Build Status](https://travis-ci.org/bokuweb/avaron.svg?branch=master)](https://travis-ci.org/bokuweb/avaron)
[![Build status](https://ci.appveyor.com/api/projects/status/uegh5k030l8xb5nb/branch/master?svg=true)](https://ci.appveyor.com/project/bokuweb/avaron/branch/master)
[![Version](https://img.shields.io/npm/v/avaron.svg)](https://www.npmjs.com/package/avaron)
![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)
   
Avaron forked from vdbwouter/electron-ava.   


## Table of Contents

- [Why?](#why?)
- [Usage](#usage)
- [Samples](#samples)
- [CI](#ci)
- [Test](#test)
- [Contribute](#contribute)
- [License](#license)

## Why?

- I want to run tests on real browser with `AVA`.
- I want to take screenshot of DOM.
   
      
You can capture the following image with a real browser when using `Avaron`.   
   
This sample is using `material-ui`'s `DatePickerDialog` component.    
Please see also, screenshot test sample     https://github.com/bokuweb/avaron/blob/master/test/renderer/renderer.test.js   

![](https://github.com/bokuweb/avaron/blob/master/docs/capture.png?raw=true)   

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
    avaron test --renderer

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
		"avaron": "*"
	},
	"avaron": {
		"renderer": true
	}
}
```

### API (Renderer process tests Only)

### isAvaronRenderer(): boolean

Return `true`, when test is running on avaron renderer.

### getCurrentWindow(): ?Electron.BrowserWindow 

Return current `BrowserWindow`, when test is running on avaron renderer.
Return `null`, when running on other browser.

### screenshot(path: string): Promise\<void\>

Takes a screenshot of the current test. Useful for visual test. The output is always a png.

``` js
import test from 'ava';
import { screenshot } from 'avaron';

test('should capture', async t => {
        await screenshot('path_to_screenshot.png');
        t.pass();
});
```   
   
Also see, `avaron`'s renderer test. (https://github.com/bokuweb/avaron/blob/master/test/renderer/renderer.test.js)

## BrowserWindow options

If you want to pass options to the browser window for the renderer process, you can do this by
adding the `windowOptions` option to your config. This object will then be passed to the
[`BrowserWindow` constructor](http://electron.atom.io/docs/api/browser-window/#new-browserwindowoptions).

```json
{
  "scripts": {
    "test": "avaron"
  },
  "devDependencies": {
    "avaron": "*"
  },
  "avaron": {
    "renderer": true,
    "fixture": "./fixture.html",
    "windowOptions": {
      "title": "avaron"
    }    
  }
}
```

### Avaron's original options

| name                         | Default     | Description                                                                                                                     |
| :--------------------------- | :-----------| :------------------------------------------------------------------------------------------------------------------------------ |
| renderer                     | `false`     | If set `true`, your tests run in the renderer process. In other words you can test with a real browser (chromium)               |
| fixture                      |  undefined  | You can custom html file for renderer test. If omitted, uses Avaron's own fixture.html file.                                    |


## Samples

- [react-avaron-sample](https://github.com/bokuweb/react-avaron-sample) - React + avaron test sample

## CI

If you want to run tests on CI, please set xvfb.
Please see also, these files.

- TravisCI - https://github.com/bokuweb/react-avaron-sample/blob/master/.travis.yml
- CircleCI - https://github.com/bokuweb/react-avaron-sample/blob/master/circle.yml



## Test

``` sh
$ npm t
```

## Contribute

PRs welcome.

## License

The MIT License (MIT)

Copyright (c) 2017 @bokuweb

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.