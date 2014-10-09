var assert = require('assert');

var Ezlog = require('./../../index.js');


describe('Ezlog', function (){
  describe('#normal usage', function (){
    it('should return a function when we `new` Ezlog', function (){
      assert.equal(typeof new Ezlog(), 'function');
    });

    it('should log ^ some colored output', function (){

      var log = new Ezlog({
        p: {t: '[prefix]', c: 'yellow', s: 'bold'},
        t: {c: 'red'}
      });

      log('Hello World!');
    });

  });

  describe('#wrong parameters', function (){
    it('should not throw when there is no `o` parameter', function (){
      assert.equal(typeof new Ezlog(), 'function');
    });

    it('should not throw when the `o` is of wrong types (!object)', function (){
      assert.equal(typeof new Ezlog('string'), 'function');
    });

    it('should not throw when the `o` is of wrong types (!object)', function (){
      assert.equal(typeof new Ezlog(['array']), 'function');
    });

    it('should not throw when we give empty `p` and `t` object parameters', function (){
      assert.equal(typeof new Ezlog({p: {}, t: {}}), 'function');
    });

  });

});