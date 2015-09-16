var f_ = require('./index.js');


var Download = require('./tests/fixtures/Download');


Download = f_.set.prototype(Download, {
  prototype_options: true,
  function_flow: [
    { name: 'method1', max_tries: 10 },
    { name: 'method2', max_tries: '?' }
  ]
});

var download = f_.set.instance(new Download(), {
  instance_options: true
});

download.start();
