var assert = require('assert');

var f_ = require(__dirname + './../../index.js'),
    TaskList = require('./../lib/TaskList.js');


describe('events', function (){

  describe('#onFinish', function (){
    it('should be able to finish the task with no onFinish (using timeout to check)', function (done){

      var taskList = f_.setInstance( new (f_.setPrototype(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify']
      })) );

      taskList.onFinish = undefined;

      taskList.start();

      setTimeout(function (){
        assert.equal(taskList.f_status, 'finished');
        done();
      }, 50);

    });
  });

  describe('#onAbort', function (){
    it('should be able to abort the task with no onAbort (using timeout to check)', function (done){

      TaskList = f_.setPrototype(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify']
      });

      var taskList = new TaskList({ abort: true });
      taskList = f_.setInstance(taskList);
      taskList.onAbort = undefined;
      taskList.start();

      setTimeout(function (){
        assert.equal(taskList.f_status, 'aborted');
        done();
      }, 50);

    });



  });


  describe('#onNext', function (){

    it('should call onNext and give it function_flow info', function (done){

      TaskList = f_.setPrototype(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify']
      });

      var taskList = new TaskList();
      taskList = f_.setInstance(taskList);
      taskList.onNext = function (info){
        if(info.f_i === TaskList.prototype.f_function_flow.length) done();
      }
      taskList.start();
    });

    it('should be able to call f_next with no onNext (using timeout to check)', function (done){

      TaskList = f_.setPrototype(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify']
      });

      var taskList = new TaskList();
      taskList = f_.setInstance(taskList);
      taskList.onNext = undefined;
      taskList.onFinish = done;
      taskList.start();
    });

  });



  describe('#retryAll', function (){

    it('should call onRetry and give us an info object', function (done){

      TaskList = f_.setPrototype(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify']
      });

      var taskList = f_.setInstance(new TaskList({ retryAllOnce: true }));
      taskList.onRetry = function (info){
        assert.equal(typeof info, 'object');
        done();
      };
      taskList.start();
    });

    it('should be able to `retryAll` with no onRetry', function (done){

      TaskList = f_.setPrototype(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify']
      });

      var taskList = new TaskList({ retryAllOnce: true });
      taskList = f_.setInstance(taskList);
      taskList.onRetry = undefined;
      taskList.onFinish = done;
      taskList.start();
    });
  });

  describe('#retryThis', function (){

    it('should call onRetry and give an info object', function (done){
      TaskList = f_.setPrototype(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify']
      });

      var taskList = f_.setInstance(new TaskList({ retryThisOnce: true }));
      taskList.onRetry = function (info){
        assert.equal(typeof info, 'object');
        done();
      };
      taskList.start();
    });

    it('should be able to `retryThis` with no onRetry', function (done){
      TaskList = f_.setPrototype(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify']
      });

      var taskList = new TaskList({ retryThisOnce: true });
      taskList = f_.setInstance(taskList);
      taskList.onRetry = undefined;
      taskList.onFinish = done;
      taskList.start();
    });

  });

});