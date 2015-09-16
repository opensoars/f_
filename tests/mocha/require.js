var assert = require('assert');

function req(path) {
  return require(__dirname + '/../../' + path);
}

describe('Requiring the module', function (){
  it('returns an object', function (){
    var f_ = req('index.js');
    assert.equal(typeof f_, 'object');
  });
  it('with at least one property', function (){
    var f_ = req('index.js'),
        c = 0;

    for (var k in f_) {
      c++;
    }

    assert.equal(c > 0, true);
  });
});