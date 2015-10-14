/**
 * Requires all instance_modules found in `~/lib/f_instance_modules/lib/`.
 * If something goes wrong the error caught by try catch will be thrown,
 * along with some basic info.
 * @module instance_modules
 */
var fs = require('fs');

var Err = process.ROOT_REQUIRE('./lib/Err');

var exports = {};

try { 
  var instance_modules = fs.readdirSync(__dirname + '/lib');

  instance_modules.forEach(function (method) {
    exports[method] = require('./lib/' + method);
  });

  module.exports = exports;
}
catch (e) {
  /* istanbul ignore next */
  Err('Something went wrong when f_ instance_modules tried to be ' +
    'required, try catch error below:\n' + e.message);
}


