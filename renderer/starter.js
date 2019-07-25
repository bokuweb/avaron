"use strict";

/* eslint-disable import/no-unassigned-import */
require("ava/lib/worker/load-chalk");

const { ipcRenderer } = require("electron");
const serializeError = require("ava/lib/serialize-error");
const require_hacker = require("require-hacker");
const fs = require("fs");
const path = require("path");

require_hacker.global_hook("ipc", p => {
  if (/\.\/ipc/.test(p)) {
    const source = fs.readFileSync(
      path.resolve(__dirname, "./ipc.js"),
      "utf-8"
    );
    return { source, path };
  }
  return;
});

require_hacker.global_hook("now-and-timers", p => {
  if (/now-and-timers/.test(p)) {
    const source = `module.exports = {
	   now: Date.now,
	   setImmediate: window.setImmediate,
	   setTimeout: window.setTimeout,	   
	   setInterval: window.setInterval, 
	 }`;
    return { source, path };
  }
  return;
});

window.__avaron__ = true;

// Below code is stub for ava process.send.
process.send = () => {};

// Below code is stub for Node.js process.channel or process._channel.
process.channel = {
  unref() {},
  ref() {}
};

// Use window.close instead of process.exit
process.exit = () => window.close();

function onUncaughtException(err) {
  ipcRenderer.send("message", "uncaughtException", {
    exception: serializeError(err)
  });
}

process.on("uncaughtException", onUncaughtException);

function parseArgv() {
  const unencodedHash = decodeURIComponent(window.location.hash.substr(1));
  return JSON.parse(unencodedHash);
}

process.argv = parseArgv();

require("./console");
require("ava/lib/worker/subprocess");
