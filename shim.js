/* eslint-disable @typescript-eslint/no-require-imports */
import { isDefined } from './src/utils/is-defined';

require('text-encoding');

// RN 0.83 still polyfills AbortSignal from `abort-controller`, which has no `timeout()`.
// octez.connect v5 probes Matrix nodes with AbortSignal.timeout(10000); without this, every
// probe throws and pairing dies with "No server responded."
/* eslint-disable no-undef */
if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout !== 'function') {
  AbortSignal.timeout = milliseconds => {
    /* eslint-enable no-undef */
    const controller = new AbortController();
    setTimeout(() => controller.abort(), milliseconds);

    return controller.signal;
  };
}

XMLHttpRequest.prototype.overrideMimeType = () => null;

if (!isDefined(global.localStorage)) {
  global.localStorage = {
    getItem: () => null
  };
}

// octez.connect-core replaces its mock windowRef with RN `window`, which has no DOM events API.
if (typeof window !== 'undefined' && typeof window.addEventListener !== 'function') {
  window.addEventListener = () => undefined;
  window.removeEventListener = () => undefined;
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
