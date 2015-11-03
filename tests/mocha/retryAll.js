var assert = require('assert');

describe('retryAll', function (){
  var f_ = require('./../../index.js');

  it('resets f_flow_i to 0 and starts the flow from the first method specified in the function_flow', function (done){
    var methods_called = 0;

    var Constructor = f_.getConstructor({
      function_flow: [
        {
          name: 'm1',
          function: function () {
            methods_called++;
            this.f_next();
          },
          max_tries: 5
        },
        {
          name: 'm2',
          function: function () {
            methods_called++;
            this.f_retryAll();
          },
          max_tries: 5
        }
      ]
    });

    var instance = new Constructor();

    instance.f_go();
    
    assert.equal(methods_called, 10);
    done();
  });

  it('emits an retryAll event', function (done) {
    var Constructor = f_.getConstructor({
      function_flow: [
        {
          name: 'm1',
          function: function () {
            this.f_next();
          },
          max_tries: 1
        },
        {
          name: 'm2',
          function: function () {
            this.f_retryAll();
          },
          max_tries: 1
        }
      ]
    });

    var instance = new Constructor();

    instance.on('retryAll', function () {
      done();
    });

    instance.f_go();

  });
});