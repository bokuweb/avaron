const globals = require('ava/lib/globals');

globals.setTimeout = setTimeout.bind(window);
globals.clearTimeout = clearTimeout.bind(window);
globals.setImmediate = setImmediate.bind(window);

module.exports = globals;
