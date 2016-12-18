# electron-ava

All the simpleness of [AVA](https://ava.li) tests for [Electron](http://electron.atom.io).

## Usage

If you are already using `ava`, you can just replace `ava` with `electron-ava`
in your `package.json` (assuming all your tests run in the main process. If
not, see [renderer tests](#renderer-process-tests)).

Otherwise, you can install `electron-ava` with the following command:

```sh
yarn add electron-ava -D
```

Or, if you prefer npm:

```sh
npm install electron-ava --save-dev
```

Then in your `package.json`, add the following to your test script:

```
electron-ava
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

### Renderer process tests

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
