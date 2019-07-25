"use strict";

require("ava/lib/worker/load-chalk");

const { app } = require("electron");
const path = require("path");
const serializeError = require("ava/lib/serialize-error");
const initializeRenderer = require("./initialize-renderer");

function onUncaughtException(err) {
  process.send({
    exception: serializeError(err)
  });
}

process.on("uncaughtException", onUncaughtException);

app.on("ready", () => {
  const opts = JSON.parse(process.argv[2]);
  process.env.AVA_PATH = path.resolve(require.resolve("ava"), "..");
  if (opts.renderer) {
    initializeRenderer(opts);
  } else {
    require("ava/lib/worker/subprocess"); // eslint-disable-line import/no-unassigned-import
    // Disable duplicate reporting
    process.removeListener("uncaughtException", onUncaughtException);
  }
});
