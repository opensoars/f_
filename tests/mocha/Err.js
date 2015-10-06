var assert = require('assert');

describe('Err', function (){

  var Err = require('./../../lib/Err');

  it('throws when initialized/called', function (done) {
    try {
      new Err();
    }
    catch (e) {
      done();
    }
  });

  it('sets the thrown error message to the passed message', function (done) {
    try {
      new Err('test123');
    }
    catch (e) {
      assert.equal(e.message, 'test123');
      done();
    }
  });

  it('sets the thrown error message to an empty string when no data is passed', function (done) {
    try {
      new Err();
    }
    catch (e) {
      assert.equal(e.message, '');
      done();
    }
  });
});