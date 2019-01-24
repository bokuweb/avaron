"use strict";

const { BrowserWindow } = require("electron");
const url = require("url");
const path = require("path");
const fs = require("fs");

module.exports = (options = {}, argv) => {
  const actualOptions = Object.assign(
    { show: false, width: 800, height: 600 },
    options.windowOptions
  );
  const window = new BrowserWindow(actualOptions);
  let fixture;
  try {
    if (options.fixture) {
      fixture = path.resolve(process.cwd(), options.fixture);
      fs.statSync(fixture);
    } else {
      fixture = path.resolve(__dirname, "../renderer/index.html");
    }
  } catch (err) {
    console.warn(
      "[warning] specified fixture file not found. use default fixture."
    );
    fixture = path.resolve(__dirname, "../renderer/index.html");
  }
  const windowURL = getURL(argv, fixture);
  const rendererDir = path.resolve(__dirname, "../renderer");
  const starter = options.fixture
    ? "./" +
      path
        .join(path.relative(path.dirname(fixture), rendererDir), "starter.js")
        .replace(/\\/g, "/")
    : "./starter.js";
  window.webContents.on("dom-ready", () => {
    window.webContents.executeJavaScript(`
			document.body.style.backgroundColor = "#fff";
			require("${starter}");
		`);
  });
  // Window.webContents.openDevTools();
  // console.log(windowURL)
  window.loadURL(windowURL);
  return window;
};

function getURL(argv, fixture) {
  const unencodedHash = JSON.stringify(argv);
  const hash = encodeURIComponent(unencodedHash);
  return url.format({
    pathname: fixture,
    protocol: "file",
    slashes: true,
    hash
  });
}
