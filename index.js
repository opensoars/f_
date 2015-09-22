/**
 * Main f_ module, this is what you get when you require('f_').
 * @module f_
 */

/**
 * Makes it a lot easier to use the fs in deeply nested file structures. This
 * is value of the `__dirname` global variable available in index.js.
 * @type {string}
 * @GLOBAL
 */
process.ROOT_DIR = __dirname;

/**
 * Makes it a lot easier to require in deeply nested file structures. This is
 * the original nodejs require function.
 * @type {function}
 * @GLOBAL
 */
process.ROOT_REQUIRE = require;


module.exports = {
  set: require('./lib/set')
};