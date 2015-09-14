/** Makes it a lot easier to use the fs in deeply nested file structures. */
process.ROOT_DIR = __dirname;

/** Makes it a lot easier to require in deeply nested file structures. */
process.ROOT_REQUIRE = require;



/**
 * @module
 */
var f_ = {

  set: {
    prototype: require('./lib/set/prototype'),
    instance: require('./lib/set/instance'),
    object: require('./lib/set/object')
  }

};


var Download = function Download() {};

Download.prototype.start = function () {};
Download.prototype.method1 = function () {};
Download.prototype.method2 = function () {};


Download = f_.set.prototype(Download);