/** Makes it a lot easier to use the fs in deeply nested file structures. */
process.ROOT_DIR = __dirname;

/** Makes it a lot easier to require in deeply nested file structures. */
process.ROOT_REQUIRE = require;


/**
 * Main f_ module, this is what you get when you require('f_').
 * @namespacce
 */
var f_ = {
  set: require('./lib/set')
};

// TESTS below @TODO move to unit/integration tests

var Download = require('./test/fixtures/Download');


Download = f_.set.prototype(Download, {
  prototype_options: true,

  function_flow: [
    'method1',
    'method2'
  ]
});

var download = f_.set.instance(new Download(), {
  instance_options: true
});

download.start();

module.exports = f_;