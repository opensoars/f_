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

// TESTS below @TODO move to unit/integration tests

var Download = require('./test/fixtures/Download');


Download = f_.set.prototype(Download, {
  prototype_options: true
});

var download = f_.set.instance(new Download(), {
  data_namespace: 'd',
  instance_options: true
});

download.start();