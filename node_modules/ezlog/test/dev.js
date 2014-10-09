var Ezlog = require('./../index.js');

var log = new Ezlog({
  p: { t: '[dev.js]', c: 'red' }
});

log('Hello World!');