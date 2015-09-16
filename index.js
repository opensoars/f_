/**
 * Main f_ module, this is what you get when you require('f_').
 * @module f_
 */

/** Makes it a lot easier to use the fs in deeply nested file structures. */
process.ROOT_DIR = __dirname;

/** Makes it a lot easier to require in deeply nested file structures. */
process.ROOT_REQUIRE = require;

module.exports = {
  set: require('./lib/set'),

  /**
   * @param {object} o - Options
   */
  getConstructor: function Constructor(o) {

    var Constructor = function () {};

    /*var flow = o.function_flow[0];
    var flow1 = o.function_flow[1];


    console.log();*/

  }
};