/** f_ project structure if it would be in one file
 * node_modules
 * colored logging functions
 * globals
 * methods
 * augment
 * setup
 */

module.exports = {

  /**
   * DEPENDENCIES
   * ./methods.js  Collection of all f_ methods
   */
  augment: require('./lib/augment.js'),


  /**
   * DEPENDENCIES
   * NONE
   */
  setup: require('./lib/setup.js')
};