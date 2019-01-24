/* eslint-disable import/no-unassigned-import */

"use strict";

const { ipcMain } = require("electron");
const createWindow = require("./create-window");

require("./renderer-console");

module.exports = opts => {
  const window = createWindow(opts, process.argv);
  addRendererEventHandlers(window);
};

function addRendererEventHandlers(window) {
  ipcMain.on("message", (event, name, data) => {
    process.send(name);
  });

  process.on("message", message => {
    if (!message.ava) {
      return;
    }
    window.webContents.send("message", message);
  });

  window.webContents.once("did-finish-load", () => {
    setTimeout(() => window.webContents.send("test-start"), 100);
  });
}
