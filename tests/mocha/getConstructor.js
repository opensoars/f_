var assert = require('assert');

describe('getConstructor', function (){

  describe('#require', function (){
    it('is returned as a function when the f_ module object  is required', function () {
      var f_ = require('./../../index.js');
      assert.equal(typeof f_.getConstructor, 'function');
    });
  });


  describe('calling the function', function (){
    var f_ = require('./../../index.js');

    it('throws when no options object is passed', function (done) {
      try {
        f_.getConstructor();
      }
      catch (e) {
        done();
      }
    });

    it('throws when no function_flow array is put in options object', function (done) {
      try {
        f_.getConstructor({});
      }
      catch (e) {
        try {
          f_.getConstructor({ function_flow: 'not an arr' });
        }
        catch (e) {
          done();
        }
      }
    });
  });


});