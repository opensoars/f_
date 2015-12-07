var assert = require('assert');

describe('instance_modules', function (){
  var f_ = require('./../../index.js');

  describe('#err', function (){
    it('adds err objects to the data array', function () {
      var test = new (f_.getConstructor({
        function_flow: []
      }));

      test.f_err('test1');
      test.f_err('test2');

      assert.equal(test.f_err.data[0].message, 'test1');
      assert.equal(test.f_err.data[1].message, 'test2');
    });

    it('emits an err event', function (done) {
      var test = new (f_.getConstructor({
        function_flow: []
      }));

      test.on('err', function (err_object) {
        assert.equal(err_object.message, 'test1');
        done();
      });

      test.f_err('test1');
    });
  });

  describe('#log', function (){
    it('adds log objects to the data array', function () {
      var test = new (f_.getConstructor({
        function_flow: []
      }));

      test.f_log('test1');
      test.f_log('test2');

      assert.equal(test.f_log.data[0].message, 'test1');
      assert.equal(test.f_log.data[1].message, 'test2');
    });

    it('emits a log event', function (done) {
      var test = new (f_.getConstructor({
        function_flow: []
      }));

      test.on('log', function (log_object) {
        assert.equal(log_object.message, 'test1');
        done();
      });

      test.f_log('test1');
    });
  });

  describe('#history', function (){
    it('gets filled with err_object and log_object', function () {
      var test = new (f_.getConstructor({
        function_flow: []
      }));

      test.f_log('test1');
      test.f_err('test2');

      assert.equal(test.f_history.data[0].message, 'test1');
      assert.equal(test.f_history.data[1].message, 'test2');
    });

    it('emits a history event', function (done) {
      var test = new (f_.getConstructor({
        function_flow: []
      }));

      test.on('history', function (history_object) {
        assert.equal(history_object.message, 'test1');
        done();
      });

      test.f_err('test1');
    });
  });
});