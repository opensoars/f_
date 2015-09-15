var assert = require('assert');

function req (path) {
  return require(__dirname + '/../../' + path);
}

describe('Requiring the module', function (){
  it('returns an object', function (){
    var f_ = req('index.js');

    console.log(f_);
  });
});