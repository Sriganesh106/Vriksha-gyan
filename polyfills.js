// Polyfill for undici compatibility issues
if (typeof global === 'undefined') {
  var global = globalThis;
}

// Fix for private class fields in older environments
if (typeof Symbol === 'undefined') {
  global.Symbol = {};
}

// Node.js polyfills for browser environment
if (typeof process === 'undefined') {
  global.process = {
    env: {},
    nextTick: function(fn) {
      setTimeout(fn, 0);
    }
  };
}

export {};
