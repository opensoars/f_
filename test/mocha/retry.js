var assert = require('assert');

var f_ = require(__dirname + './../../index.js'),
    TaskList = require('./../lib/TaskList.js');


describe('retry', function (){

  describe('#retryAllOnce', function (){
    it('should call `onFinish` because we do not exceed maxRetries', function (done){
      
      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        maxRetries: { all: 1 }
      });

      var taskList = new TaskList({ retryAllOnce: true });
      taskList = f_.setup(taskList);
      taskList.onFinish = done;
      taskList.start();

    });

    it('should have set `f_retries.all` to `1`', function (done){
      
      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        maxRetries: { all: 1 }
      });

      var taskList = new TaskList({ retryAllOnce: true });
      taskList = f_.setup(taskList);

      taskList.onFinish = function (){
        assert.equal(taskList.f_retries.all, 1);
        done();
      };

      taskList.start();

    });


    it('`(f_.retries.all - 1)` should be equal to `maxRetries`', function (done){
      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        maxRetries: { all: 5 }
      });

      var taskList = new TaskList({ exceedRetries: true });
      taskList = f_.setup(taskList);

      taskList.onAbort = function (){
        assert.equal( (this.f_retries.all - 1) , TaskList.prototype.f_maxRetries.all);
        done();
      };
      taskList.start();

    });


    it('should abort when `maxRetries.all` is `1` and we try twice', function (done){
      
      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        maxRetries: { all: 1 }
      });

      var taskList = new TaskList({ exceedRetries: true });
      taskList = f_.setup(taskList);
      taskList.onAbort = done;
      taskList.start();

    });

    /**
     * Write onRetry test
     */


  });


  describe('#emptyErr', function (){
    it('should be able to retry when no errors are given', function (done){

      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify']
      });

      var taskList = new TaskList({ emptyRetryErr: true });
      taskList = f_.setup(taskList);
      taskList.onFinish = done;
      taskList.start();
    });
  });


  describe('#data namespace reset', function (){
    it('should have set instance.d to {}', function (done){

      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        maxRetries: { all: 1 },
        resetOnRetryAll: true
      });

      var taskList = new TaskList({ retryAllOnce: true });
      taskList = f_.setup(taskList);
      taskList.onRetryAll = function (){
        assert.equal(this.d.constructor, {}.constructor);
      };
      taskList.onFinish = done;
      taskList.start();

    });
  });

  describe('#retryThis', function (done){

    it('should run normaly when 1 method retry is done with no maxRetries set', function (done){
      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        maxRetries: {}
      });

      var taskList = new TaskList({ retryThisOnce: true });
      taskList = f_.setup(taskList);
      taskList.onFinish = done;
      taskList.start();
    });

    it('should call onRetry and give us an info object', function (done){

      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        maxRetries: { notify: 2 }
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
        functionFlow: ['getSource', 'writeSource', 'notify'],
        desc: 'dev.js task list',
        toLog: ['all'],
        maxRetries: {
          writeSource: 1
        }
      });

      var taskList = new TaskList({ retryThisOnce: true });
      taskList = f_.setup(taskList);
      taskList.onAbort = done;
      taskList.start();
    });

    /**
     * Write onRetry test
     */

  });




});