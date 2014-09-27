var assert = require('assert');

var f_ = require(__dirname + './../../index.js'),
    TaskList = require('./../lib/TaskList.js');


describe('noOnEvents', function (){

  describe('#onFinish', function (){
    it('should be able to finish the task with no onFinish (using timeout to check)', function (done){

      var taskList = f_.setup( new (f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify']
      })) );

      taskList.onFinish = undefined;

      taskList.start();

      setTimeout(function (){
        assert.equal(taskList.f_status, 'finished');
        done();
      }, 125);

    });
  });

  describe('#onAbort', function (){
    it('should be able to abort the task with no onAbort (using timeout to check)', function (done){

      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify']
      });

      var taskList = new TaskList({ abort: true });
      taskList = f_.setup(taskList);
      taskList.onAbort = undefined;
      taskList.start();

      setTimeout(function (){
        assert.equal(taskList.f_status, 'aborted');
        done();
      }, 125);

    });
  });


  describe('#onNext', function (){
    it('should be able to call f_next with no onNext (using timeout to check)', function (done){

      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify']
      });

      var taskList = new TaskList();
      taskList = f_.setup(taskList);
      taskList.onNext = undefined;
      taskList.start();

      setTimeout(function (){
        assert.equal(taskList.f_status, 'finished');
        done();
      }, 125);

    });
  });


  describe('#onRetryAll', function (){
    it('should be able to call retryAll with no onRetryAll', function (done){

      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        retryAllOnce: true
      });

      var taskList = new TaskList();

      taskList.onRetryAll = function (){
        console.log('OMG OMGOMOMGG RETRY ALL');
      };

      taskList = f_.setup(taskList);


      taskList.onFinish = done;

      taskList.start();


    });
  });


});