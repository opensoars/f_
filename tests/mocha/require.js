var assert = require('assert');

describe('requiring the f_ index.js file', function (){
  it('returns an object', function () {
    var f_ = require('./../../index.js');
    assert.equal(typeof f_, 'object');
  }); 
});