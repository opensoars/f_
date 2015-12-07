var assert = require('assert');

describe('methods', function (){

  var f_ = require('./../../index.js');

  describe('#abort', function (){
    it('emits an abort event with an err_object.message prefixed with "abort, "', function (done){
      var test = new (f_.getConstructor({
        function_flow: []
      }));

      test.on('abort', function (err_object) {
        assert.equal(err_object.message, 'abort, test1');
        done();
      });

      test.f_abort('test1');
    });

    it('results in not calling any more functions from function_flow', function (done) {
      var next_called = false;

      var test = new (f_.getConstructor({
        function_flow: [
          { name: 'one', function: function () { this.f_abort(); } },
          { name: 'two', function: function () { this.f_next(); } }
        ]
      }));

      setTimeout(function () {
        assert.equal(next_called, false);
        done();
      }, 50);

      test.f_go();

      test.on('next', function () {
        next_called = true;
      });
    });
  });

  describe('#next', function () {
    it('calls all methods in the function_flow', function () {
      var method1_called = false,
          method2_called = false;

      var instance = (new (f_.getConstructor({
        function_flow: [
          { name: 'one', function: function () { method1_called = true; } },
          { name: 'two', function: function () { method2_called = true; } }
        ]
      }))).f_go();

      instance.on('finish', function () {
        assert.equal(method1_called, true);
        assert.equal(method2_called, true);
        done();
      });
    });
  });

  describe('#go', function (){
    it('calls f_next with the passed arguments', function (done){
      var test = new (f_.getConstructor({
        function_flow: [
          { name: 'one',
            function: function (test1, test2) {
              assert.equal(test1, 'test1');
              assert.equal(test2, 'test2');
              done();
            }
          },
        ]
      }));

      test.f_go('test1', 'test2');
    });
  });

});