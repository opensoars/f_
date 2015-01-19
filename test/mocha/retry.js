var assert = require('assert');

var f_ = require(__dirname + './../../index.js'),
    TaskList = require('./../lib/TaskList.js');


describe('retry', function (){

  describe('#unlimited method tries', function (){
    it('should be able to finish, since there is no maxTries limit', function (){
      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify'],
        maxTries: {
          whole_list: 2,
          getSource: '?',
          writeSource: '?',
          notify: '?'
        }
      });

      var taskList = new TaskList({ retryAllOnce: true });
      taskList = f_.setup(taskList);

      taskList.start();
    });
  });


  describe('#retryAll', function (){
    it('should call `onFinish` because we do not exceed maxTries', function (done){
      
      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify'],
        maxTries: { whole_list: 2 }
      });

      var taskList = new TaskList({ retryAllOnce: true });
      taskList = f_.setup(taskList);
      taskList.onFinish = done;
      taskList.start();

    });

    it('should have set `f_tries.whole_list` to `2`', function (done){
      
      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify'],
        maxTries: { whole_list: 2 }
      });

      var taskList = new TaskList({ retryAllOnce: true });
      taskList = f_.setup(taskList);

      taskList.onFinish = function (){
        assert.equal(this.f_tries.whole_list, 2);
        done();
      };

      taskList.start();

    });


    it('`(f_.tries.whole_list - 1)` should be equal to `maxTries` (+1 cuz of abort when to much tries )', function (done){
      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify'],
        maxTries: { whole_list: 1 }
      });

      var taskList = new TaskList({ exceedRetries: true });
      taskList = f_.setup(taskList);

      taskList.onAbort = function (){
        assert.equal( (this.f_tries.whole_list - 1) , TaskList.prototype.f_maxTries.whole_list);
        done();
      };
      taskList.start();

    });


    it('should abort when `maxTries.whole_list` is `1` and we try twice', function (done){
      
      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify'],
        maxTries: { whole_list: 1 }
      });

      var taskList = new TaskList({ exceedRetries: true });
      taskList = f_.setup(taskList);
      taskList.onAbort = done;
      taskList.start();

    });

    it('should call onRetry and give us an info object', function (done){

      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify'],
        maxTries: { whole_list: 1 }
      });

      var taskList = new TaskList({ retryAllOnce: true });
      taskList = f_.setup(taskList);
      taskList.onRetry = function (info){
        assert.equal(typeof info, 'object');
        done();
      }
      taskList.start();

    });

  });


  describe('#emptyErr', function (){
    it('should be able to retry when no errors are given', function (done){

      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify']
      });

      var taskList = new TaskList({ emptyRetryErr: true });
      taskList = f_.setup(taskList);
      taskList.onFinish = done;
      taskList.start();
    });
  });


  describe('#data namespace reset', function (){
    it('should have set instance.d to {}', function (done){

      var dHasProperty = false;

      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify'],
        maxTries: { whole_list: 2 },
        resetOnRetryAll: true
      });

      var taskList = new TaskList({ retryAllOnce: true });
      taskList = f_.setup(taskList);
      taskList.onRetry = function (){
        for(var key in this.d) dHasProperty;
      };
      taskList.onFinish = function (){
        assert.equal(dHasProperty, false);
        done();
      }
      taskList.start();

    });
  });

  describe('#retryThis', function (done){

    it('should run normaly when 1 method retry is done with no maxTries set', function (done){
      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify'],
        maxTries: {}
      });

      var taskList = new TaskList({ retryThisOnce: true });
      taskList = f_.setup(taskList);
      taskList.onFinish = done;
      taskList.start();
    });

    it('should call onRetry and give us an info object', function (done){

      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify'],
        maxTries: { writeSource: 2 }
      });

      var taskList = new TaskList({ retryThisOnce: true });
      taskList = f_.setup(taskList);

      taskList.onRetry = function (info){
        assert.equal(typeof info, 'object');
        done();
      };

      taskList.start();
    });


    it('should abort when we retry a specific method to many times', function (done){

      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify'],
        desc: 'dev.js task list',
        maxTries: {
          writeSource: 1
        }
      });

      var taskList = new TaskList({ retryThisOnce: true });
      taskList = f_.setup(taskList);
      taskList.onAbort = done;
      taskList.start();
    });

    it('should call onRetry and give us an info object', function (done){

      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify']
      });

      var taskList = new TaskList({ retryThisOnce: true });
      taskList = f_.setup(taskList);
      taskList.onRetry = function (info){
        assert.equal(typeof info, 'object');
        done();
      }
      taskList.start();

    });

    it('should not call addErr if `desc` and `err` are undefined', function (done){
      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify']
      });

      var taskList = new TaskList({ retryThisOnceWithoutInfo: true });
      taskList = f_.setup(taskList);
      taskList.onFinish = function (){
        assert.equal(this.f_errs.length, 0);
        done();
      }
      taskList.start();
    });

  });

  describe('#retryFrom', function (){

    it('should run `writeSource` and `notify` twice', function (done){
      
      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify']
      });

      var taskList = new TaskList({ retryFromOnce: true });
      taskList = f_.setup(taskList);
      taskList.onFinish = function (){
        assert.equal(this.f_tries.writeSource, 2);
        assert.equal(this.f_tries.notify, 2);
        done();
      }
      taskList.start();

    });

    it('should call `onRetry` and give us an `info` object containing the method to retry from', function (done){
      
      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify']
      });

      var taskList = new TaskList({ retryFromOnce: true });
      taskList = f_.setup(taskList);
      taskList.onRetry = function (info){
        assert.equal(info.method, 'writeSource')
        done();
      }
      taskList.start();
    });

    it('should not add an error object when do not give any arguments but the method to retryFrom', function (done){
      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify']
      });

      var taskList = new TaskList({ retryFromOnceWithoutInfo: true });
      taskList = f_.setup(taskList);
      taskList.onRetry = function (info){
        assert.equal(this.f_errs.length, 0);
        done();
      }
      taskList.start();
    });

    it('should not retry anything when the method given is not found in function_flow', function (done){

      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify']
      });

      var taskList = new TaskList({ retryFromOnceWithWrongMethod: true });
      taskList = f_.setup(taskList);
      taskList.onRetry = function (info){
        assert.equal(this.f_tries.writeSource, 1);
        assert.equal(this.f_tries.notify, 1);
        done();
      }
      taskList.start();

    });

  });



  describe('#retryMethod', function (){
    it('should run `writeSource` twice', function (done){
      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify']
      });

      var taskList = new TaskList({ retryMethodOnce: true });
      taskList = f_.setup(taskList);
      taskList.onFinish = function (){
        assert.equal(this.f_tries.writeSource, 2);
        done();
      }
      taskList.start();
    });

    it('should run `getSource` and `notify` once', function (done){
      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify']
      });

      var taskList = new TaskList({ retryMethodOnce: true });
      taskList = f_.setup(taskList);
      taskList.onFinish = function (){
        assert.equal(this.f_tries.getSource, 1);
        assert.equal(this.f_tries.notify, 1);
        done();
      }
      taskList.start();
    });


    it('should run give us an info object', function (done){
      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify']
      });

      var taskList = new TaskList({ retryMethodOnce: true });
      taskList = f_.setup(taskList);
      taskList.onRetry = function (info){
        assert.equal(typeof info, 'object');
        done();
      }
      taskList.start();
    });

    it('should work when `old_f_i === 0` (run retryMethod from first method)', function (done){
      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify']
      });

      var taskList = new TaskList({ retryMethodOnceFromFirst: true });
      taskList = f_.setup(taskList);

      taskList.onFinish = done;

      taskList.start();
    });


    it('should call onNext', function (done){

      var onNextCalled = true;

      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify']
      });

      var taskList = new TaskList({ retryMethodOnce: true });
      taskList = f_.setup(taskList);
      taskList.onNext = function (){ onNextCalled = true; }
      taskList.onFinish = function (){
        assert.equal(onNextCalled, true);
        done();
      }
      taskList.start();
    });


    it('should call `next` when no `cb` is given to `retryMethod` (results in finish)', function (done){
      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify']
      });
      var taskList = new TaskList({ retryMethodOnceWithoutCb: true });
      taskList = f_.setup(taskList);
      taskList.onFinish = done;
      taskList.start();
    });


    it('should not add any errors when we just give `method` and `cb`', function (done){
      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify']
      });
      var taskList = new TaskList({ retryMethodOnceWithoutInfo: true });
      taskList = f_.setup(taskList);
      taskList.onFinish = function (){
        assert.equal(this.f_errs.length, 0);
        done();
      }
      taskList.start();
    });

    it('should not throw when a wrong method name is given, it should continue normaly', function (done){
      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify']
      });
      var taskList = new TaskList({ retryMethodOnceWithWrongMethod: true });
      taskList = f_.setup(taskList);
      taskList.onFinish = done;
      taskList.start();
    });

    it('should give us one error, when a wrong method name is given', function (done){
      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify']
      });
      var taskList = new TaskList({ retryMethodOnceWithWrongMethod: true });
      taskList = f_.setup(taskList);
      taskList.onFinish = function (){
        assert.equal(this.f_errs.length, 1);
        assert.equal(this.f_errs[0].desc, '@retryMethod  Could not find method: wrongMethod');
        done();
      }
      taskList.start();
    });


  });


});