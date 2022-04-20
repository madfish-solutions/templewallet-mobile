/* eslint-disable @typescript-eslint/no-var-requires */
import { isDefined } from './src/utils/is-defined';

require('text-encoding');

XMLHttpRequest.prototype.overrideMimeType = () => null;

if (!isDefined(global.localStorage)) {
  global.localStorage = {
    getItem: () => null
  };
}

if (!isDefined(global.document)) {
  global.document = {
    addEventListener: () => null
  };
}

if (typeof __dirname === 'undefined') {
  global.__dirname = '/';
}
if (typeof __filename === 'undefined') {
  global.__filename = '';
}
if (typeof process === 'undefined') {
  global.process = require('process');
} else {
  const bProcess = require('process');
  for (var p in bProcess) {
    if (!(p in process)) {
      process[p] = bProcess[p];
    }
  }
}

//TODO: Fix

// if(global.performance == null) {
//   global.performance = {
//     now: global._chronoNow
//   };
// }

process.browser = false;
if (typeof Buffer === 'undefined') {
  global.Buffer = require('buffer').Buffer;
}

// global.location = global.location || { port: 80 }
const isDev = typeof __DEV__ === 'boolean' && __DEV__;
process.env.NODE_ENV = isDev ? 'development' : 'production';
if (typeof localStorage !== 'undefined') {
  localStorage.debug = isDev ? '*' : '';
}

// If using the crypto shim, uncomment the following line to ensure
// crypto is loaded first, so it can populate global.crypto
require('crypto');
