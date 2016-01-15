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
    it('calls all methods in the function_flow and emits the finish event', function (done) {
      var method1_called = false,
          method2_called = false;

          // @TODO FIX
      var instance = (new (f_.getConstructor({
        function_flow: [
          { name: 'one', function: function () { method1_called = true; this.f_next(); } },
          { name: 'two', function: function () { method2_called = true; this.f_next(); } }
        ]
      }))).f_go();

      setTimeout(function () {
        assert.equal(method1_called, true);
        assert.equal(method2_called, true);
        done();
      }, 50);
    });
    it('emits the finish event when all methods in function_flow are completed', function (done) {
      var method1_called = false,
          method2_called = false;

      var instance = new (f_.getConstructor({
        function_flow: [
          { name: 'one', function: function () { method1_called = true; this.f_next(); } },
          { name: 'two', function: function () { method2_called = true; this.f_next(); } }
        ]
      }));

      instance.on('finish', function () {
        done();
      });

      instance.f_go();
    });

    it('emits an error event/object when there is no function in function_flow (deletion?)', function (done) {
      var instance = new (f_.getConstructor({
        function_flow: [
          { name: 'one', function: function () { } },
          { name: 'two', function: function () { } }
        ]
      }));

      instance.on('abort', function (err) {
        done();
      });

      instance.f_go();
      instance.f_function_flow[1] = undefined;
      instance.f_next();
    });

    it('emits an error event/object when there is no function in function_flow (deletion?)', function (done) {
      var instance = new (f_.getConstructor({
        function_flow: [
          { name: 'one', function: function () { } },
          { name: 'two', function: function () { } }
        ]
      }));

      instance.on('abort', function (err) {
        done();
      });

      instance.f_go();
      instance.f_function_flow[1].name = undefined;
      instance.f_next();
    });

    it('emits an error event/object when the next item in the function_flow is not a function', function (done) {
      var instance = new (f_.getConstructor({
        function_flow: [
          { name: 'one', function: function () { } },
          { name: 'two', function: function () { } }
        ]
      }));

      instance.on('abort', function (err) {
        done();
      });

      instance.f_go();
      instance.f_function_flow[1] = { name: 'test', tries: 2, max_tries: 1 };
      instance.f_next();
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

  describe('#retryAll', function (){
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

  describe('#retryThis', function () {
    it('restarts the f_ task list from where retryThis was called', function (done) {
      var called_m2 = false;

      var Constructor = f_.getConstructor({
        function_flow: [
          {
            name: 'm1',
            function: function () {
              this.f_next();
            },
            max_tries: 5
          },
          {
            name: 'm2',
            function: function () {
              if (called_m2) {
                this.f_next();
              }
              else {
                called_m2 = true;
                this.f_retryThis();
              }
            },
            max_tries: 5
          }
        ]
      });

      var instance = new Constructor();

      instance.on('retryThis', function () {
        assert.equal(called_m2, true);
        done();
      });

      instance.f_go();
    });

    it('emits an retryThis/error event', function (done) {
      var called_m2 = false;

      var Constructor = f_.getConstructor({
        function_flow: [
          {
            name: 'm1',
            function: function () {
              this.f_next();
            },
            max_tries: 5
          },
          {
            name: 'm2',
            function: function () {
              if (called_m2) {
                this.f_next();
              }
              else {
                called_m2 = true;
                this.f_retryThis();
              }
            },
            max_tries: 5
          }
        ]
      });

      var instance = new Constructor();

      instance.on('retryThis', function () {
        done();
      });

      instance.f_go();
    });
  });


  describe('#retryFrom', function () {
    it('restarts the f_task list from the method given as a string as argument 1', function (done) {
      var called_m2 = false;

      var Constructor = f_.getConstructor({
        function_flow: [
          {
            name: 'm1',
            function: function () {
              this.f_next();
            },
            max_tries: 5
          },
          {
            name: 'm2',
            function: function () {
              if (called_m2) {
                this.f_next();
              }
              else {
                called_m2 = true;
                this.f_retryFrom('m1');
              }
            },
            max_tries: 5
          }
        ]
      });

      var instance = new Constructor();

      instance.on('finish', function () {
        var tried_twice = true;

        this.f_function_flow.forEach(function (flow) {
          console.log(flow.tries);
          if (flow.tries !== 2) {
            tried_twice = false;
          }
        });
        assert.equal(tried_twice, true);
        done();
      });

      instance.f_go();
    });
  
    it('sets the flow_i to the index of the method passed in function_flow + 1', function (done) {
      var Constructor = f_.getConstructor({
        function_flow: [
          {
            name: 'm1',
            function: function () {
            },
            max_tries: 5
          },
          {
            name: 'm2',
            function: function () {
            },
            max_tries: 5
          }
        ]
      });

      var instance = new Constructor();

      instance.f_go();
      instance.f_next();
      instance.f_retryFrom('m1');

      assert.equal(instance.f_flow_i, 1);
      done();
    });

    it('emits abort event/error when no function is found to call', function (done) {
      var Constructor = f_.getConstructor({
        function_flow: [
          {
            name: 'm1',
            function: function () {
              this.f_next();
            },
            max_tries: 5
          },
          {
            name: 'm2',
            function: function () {
              this.m1 = undefined;
              this.f_retryFrom('m1');
            },
            max_tries: 5
          }
        ]
      });

      var instance = new Constructor();

      instance.on('abort', function () {
        done();
      });

      instance.f_go();
    });

  }); 


});