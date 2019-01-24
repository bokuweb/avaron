module.exports = {
  isAvaronRenderer() {
    if (typeof window === "undefined") {
      return false;
    }
    return Boolean(window && window.__avaron__);
  },
  getCurrentWindow() {
    if (typeof window === "undefined") {
      return;
    }
    if (window.__avaron__) {
      const { remote } = require("electron");
      return remote.getCurrentWindow();
    }
  },
  screenshot(imagePath) {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined") {
        return resolve();
      }
      if (!window.__avaron__) {
        return resolve();
      }
      const fs = require("fs");
      const { remote } = require("electron");
      const mkdirp = require("make-dir");
      const path = require("path");
      const win = remote.getCurrentWindow();
      requestIdleCallback(
        () => {
          win.capturePage(img => {
            const size = img.getSize();
            const ratio = window.devicePixelRatio;
            const png = img
              .resize({
                width: size.width / ratio,
                height: size.height / ratio
              })
              .toDataURL();
            const data = png.split(",")[1];
            mkdirp(path.dirname(imagePath))
              .then(() => {
                fs.writeFile(imagePath, data, "base64", resolve);
              })
              .catch(err => {
                reject(err);
              });
          });
        },
        { timeout: 1000 }
      );
    });
  }
};
