const assert = require('assert');

// Minimal DOM stubs so script.js can be loaded under Node
const dummy = new Proxy(function () {}, {
  get: (target, prop) => {
    if (prop === 'width' || prop === 'height') return 0;
    return dummy;
  },
  apply: () => dummy,
  set: () => true,
});
global.window = dummy;
global.document = dummy;

const { simpleHash } = require('../script.js');

// Test that simpleHash produces expected hash for known input
assert.strictEqual(simpleHash('AaBb'), 'A2B2');

// Two different inputs with identical character counts yield the same hash
assert.strictEqual(simpleHash('abc'), simpleHash('cba'));

console.log('All tests passed.');
