var assert = require('assert');

var f_ = require(__dirname + './../../index.js'),
    TaskList = require('./../lib/TaskList.js');


describe('#reset', function (){


  describe('#retryAllOnce', function (){
    it('should call onFinish', function (done){
      
      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        maxRetries: { all: 1 }
      });

      var taskList = new TaskList({ retryAllOnce: true });
      taskList = f_.setup(taskList);
      taskList.onFinish = done;
      taskList.start();

    });

    it('should have set f_retries.all to 1', function (done){
      
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
        functionFlow: ['getSource', 'writeSource', 'notify']
      });

      var taskList = new TaskList({ exceedRetries: true });
      taskList = f_.setup(taskList);

      taskList.onAbort = function (){
        assert.equal( (this.f_retries.all - 1) , TaskList.prototype.f_maxRetries.all);
        done();
      };
      taskList.start();

    });


    it('should abort when maxRetries.all = 1 and we try twice', function (done){
      
      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        maxRetries: { all: 1 }
      });

      var taskList = new TaskList({ exceedRetries: true });
      taskList = f_.setup(taskList);
      taskList.onAbort = done;
      taskList.start();

    });

  });


  describe('#emptyErr', function (){
    it('f_ should be able to retry when no errors are given', function (done){

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


  describe('#logging', function (){
    it('should log retry information ^ ^ ^ when toLog[\'retry\'] is set', function (done){

      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        maxRetries: { all: 1 },
        toLog: ['retry']
      });

      var taskList = new TaskList({ retryAllOnce: true });
      taskList = f_.setup(taskList);
      taskList.onFinish = done;
      taskList.start();

    });

    it('should even log ^ ^ ^ when no details are given to log', function (done){

      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        maxRetries: { all: 1 },
        toLog: ['retry']
      });

      var taskList = new TaskList({ emptyRetryErr: true });
      taskList = f_.setup(taskList);
      taskList.onFinish = done;
      taskList.start();

    });

  });

  describe('#retryThis', function (done){


/*
    it('should run normaly when 1 method retry is done with no maxTries set', function (){
      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        maxRetries: {},
        toLog: ['none']
      });

      var taskList = new TaskList({ retryThis: true });
      taskList = f_.setup(taskList);
      taskList.onFinish = done;
      taskList.start();
    });

    it('should call onRetryThis', function (done){

      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        maxRetries: {},
        toLog: ['none']
      });

      var taskList = new TaskList({ retryThis: true });
      taskList = f_.setup(taskList);
      taskList.onRetryThis = done;
      taskList.start();
    });
*/


    /**
     * MAYBE WE SHOULD FIX maxRetries.methodName   instead of maxTries.methodName being
     * something separate
     * use f_retryThis  Test for method tries count
     *   run onRetryThis
     *   DONT run onRetryThis
     *
     * Exceed specific retries, can be done with setting maxTries.method: 0
     *
     * Fix functionFlowTest.js
     */
  });



});