'use strict';
const globals = require('ava/lib/globals');

globals.setTimeout = setTimeout.bind(undefined);
globals.clearTimeout = clearTimeout.bind(undefined);
globals.setImmediate = setImmediate.bind(undefined);
