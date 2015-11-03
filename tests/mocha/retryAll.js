var assert = require('assert');

describe('retryAll', function (){
  it('resets f_flow_i to 0 and starts the flow from the first method specified in the function_flow', function (done){
    var f_ = require('./../../index.js');

    var methods_called = 0;

    var Constructor = f_.getConstructor({
      function_flow: [
        m1: function () {
          methods_called++;
          this.f_next();
        },
        m2: function () {
          methods_called++;
          this.f_next();
        },
        m3: function () {
          methods_called++;
          this.f_next();
        }
      ]
    });

    (new Constructor()).go();

  });
});