/**
 * Requires all methods found in `~/lib/f_instance_modules/lib/`. If something
 * goes wrong the error caught by try catch will be thrown, along with
 * some basic info.
 * @module instance_modules
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
  new Err('Something went wrong when f_ methods tried to be required, try ' +
    'catch error below:\n' + e.message);
}

