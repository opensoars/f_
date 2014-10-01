var assert = require('assert');

var f_ = require(__dirname + './../../index.js'),
    TaskList = require('./../lib/TaskList.js');


describe('retry', function (){

  describe('#unlimited method tries', function (){
    it('should be able to finish, since there is no maxTries limit', function (){
      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        maxTries: {
          wholeList: 2,
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


  describe('#retryAllOnce', function (){
    it('should call `onFinish` because we do not exceed maxTries', function (done){
      
      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        maxTries: { wholeList: 2 }
      });

      var taskList = new TaskList({ retryAllOnce: true });
      taskList = f_.setup(taskList);
      taskList.onFinish = done;
      taskList.start();

    });

    it('should have set `f_tries.wholeList` to `2`', function (done){
      
      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        maxTries: { wholeList: 2 }
      });

      var taskList = new TaskList({ retryAllOnce: true });
      taskList = f_.setup(taskList);

      taskList.onFinish = function (){
        assert.equal(this.f_tries.wholeList, 2);
        done();
      };

      taskList.start();

    });


    it('`(f_.tries.wholeList - 1)` should be equal to `maxTries` (+1 cuz of abort when to much tries )', function (done){
      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        maxTries: { wholeList: 1 }
      });

      var taskList = new TaskList({ exceedRetries: true });
      taskList = f_.setup(taskList);

      taskList.onAbort = function (){
        assert.equal( (this.f_tries.wholeList - 1) , TaskList.prototype.f_maxTries.wholeList);
        done();
      };
      taskList.start();

    });


    it('should abort when `maxTries.wholeList` is `1` and we try twice', function (done){
      
      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        maxTries: { wholeList: 1 }
      });

      var taskList = new TaskList({ exceedRetries: true });
      taskList = f_.setup(taskList);
      taskList.onAbort = done;
      taskList.start();

    });

    it('should call onRetry and give us an info object', function (done){

      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        maxTries: { wholeList: 1 }
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
        maxTries: { wholeList: 2 },
        resetOnRetryAll: true
      });

      var taskList = new TaskList({ retryAllOnce: true });
      taskList = f_.setup(taskList);
      taskList.onRetry = function (){
        assert.equal(this.d.constructor, {}.constructor);
      };
      taskList.onFinish = done;
      taskList.start();

    });
  });

  describe('#retryThis', function (done){

    it('should run normaly when 1 method retry is done with no maxTries set', function (done){
      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        maxTries: {}
      });

      var taskList = new TaskList({ retryThisOnce: true });
      taskList = f_.setup(taskList);
      taskList.onFinish = done;
      taskList.start();
    });

    it('should call onRetry and give us an info object', function (done){

      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
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
        functionFlow: ['getSource', 'writeSource', 'notify'],
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
        functionFlow: ['getSource', 'writeSource', 'notify']
      });

      var taskList = new TaskList({ retryThisOnce: true });
      taskList = f_.setup(taskList);
      taskList.onRetry = function (info){
        assert.equal(typeof info, 'object');
        done();
      }
      taskList.start();

    });

  });




});