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

  describe('#method retries', function (){
    /**
     * use f_retryThis  Test for method tries count
     *   run onRetryThis
     *   DONT run onRetryThis
     *
     *
     */
  });



});