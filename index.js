/**
 * Main f_ module, this is what you get when you require('f_').
 * @module f_
 */

/** Makes it a lot easier to use the fs in deeply nested file structures. */
process.ROOT_DIR = __dirname;

/** Makes it a lot easier to require in deeply nested file structures. */
process.ROOT_REQUIRE = require;

module.exports = {
  set: require('./lib/set')
};