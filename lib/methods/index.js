/**
 * Requires all methods found in `~/lib/f_methods/lib/`. If something goes wrong
 * the error caught by try catch will be thrown, along with some basic info.
 * @module methods
 */
var fs = require('fs');

var Err = process.ROOT_REQUIRE('./lib/Err');

var exports = {};

try { 
  var methods = fs.readdirSync(__dirname + '/lib');

  methods.forEach(function (method) {
    exports[method] = require('./lib/' + method);
  });

  module.exports = exports;
}
catch (e) {
  /* istanbul ignore next */
  Err('Something went wrong when f_ methods tried to be required, try ' +
    'catch error below:\n' + e.message);
}


