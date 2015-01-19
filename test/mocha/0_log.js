/**
 * File is called 0_log.js because we don't want to have weird logging
 * inbetween the mocha logging
 * For readability, last `it` in this test should contain \n - - - - `hr`
 *
 * Logging can result in weird results because the f_ / cls / ezlog code is
 * not run in a synchronous way which ofcourse is not wanted. But it CAN
 * produce logging in wrong order in this test suite. Just ignore it!
 */

var hr = '\n\n - - - - - - - - - - - - - - - - - END `f_ logging`'
    + '- - - - - - - - - - - - - - - - - ';

var assert = require('assert');

var f_ = require(__dirname + './../../index.js'),
    TaskList = require('./../lib/TaskList.js');


describe('log', function (){

  describe('#start', function (){

    it('should log ^ about start (with blue desc)', function (){
      f_.setup( new (f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify'],
        to_log: ['start'],
        desc: 'f_ logging #start task list'
      })) ).start();
    });

    it('should log ^ about start (but no blue desc)', function (){
      f_.setup( new (f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify'],
        to_log: ['start']
      })) ).start();
    });

  });

  describe('#normal run', function (){

    it('should log ^ start next and finish', function (done){
      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify'],
        to_log: ['all'],
        desc: 'logAll task list'
      });

      var taskList = new TaskList();
      taskList = f_.setup(taskList);
      taskList.onFinish = done;
      taskList.start();
    });
    
  });


  describe('#infinite retries', function (){
    it('^ should not log /max_tries information just current try', function (done){

      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify'],
        to_log: ['all'],
        desc: 'logAll task list',
        max_tries: {
          whole_list: '?',
          getSource: '?',
          writeSource: '?',
          notify: '?'
        }
      });

      var taskList = new TaskList();
      taskList = f_.setup(taskList);
      taskList.onFinish = done;
      taskList.start();
    });

  });


  describe('#finite retries', function (){
    it('should log ^ about method attempts', function (done){
      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify'],
        to_log: ['next'],
        max_tries: { writeSource: 2 }
      });

      var taskList = new TaskList();
      taskList = f_.setup(taskList);
      taskList.onFinish = done;
      taskList.start();
    });
  });


  describe('#retry', function (){

    describe('##retryAll', function (){

      it('should log ^ retry information when to_log[\'retry\'] is set', function (done){

        TaskList = f_.augment(TaskList, {
          function_flow: ['getSource', 'writeSource', 'notify'],
          max_tries: { whole_list: 2 },
          to_log: ['retry']
        });

        var taskList = new TaskList({ retryAllOnce: true });
        taskList = f_.setup(taskList);
        taskList.onFinish = done;
        taskList.start();
      });

      it('should log ^ even when no details are given to log', function (done){

        TaskList = f_.augment(TaskList, {
          function_flow: ['getSource', 'writeSource', 'notify'],
          max_tries: { whole_list: 2 },
          to_log: ['retry']
        });

        var taskList = new TaskList({ emptyRetryErr: true });
        taskList = f_.setup(taskList);
        taskList.onFinish = done;
        taskList.start();
      });

    });

    describe('##retryFrom', function (){
      it('should log ^ about not being able to find method when we call retryFrom with wrong method name', function (done){

        TaskList = f_.augment(TaskList, {
          function_flow: ['getSource', 'writeSource', 'notify'],
          to_log: ['retry']
        });

        var taskList = new TaskList({ retryFromOnceWithWrongMethod: true });
        taskList = f_.setup(taskList);
        taskList.onRetry = function (){
          done();
        }
        taskList.start();
      });

      it('should log ^ NO desc:', function (done){
        TaskList = f_.augment(TaskList, {
          function_flow: ['getSource', 'writeSource', 'notify'],
          to_log: ['retry']
        });

        var taskList = new TaskList({ retryFromOnceWithWrongMethodWithoutInfo: true });
        taskList = f_.setup(taskList);
        taskList.onRetry = function (){
          done();
        }
        taskList.start();
      });

      it('should log ^ retry information', function (done){
        TaskList = f_.augment(TaskList, {
          function_flow: ['getSource', 'writeSource', 'notify'],
          to_log: ['retry']
        });

        var taskList = new TaskList({ retryFromOnce: true });
        taskList = f_.setup(taskList);
        taskList.onRetry = function (){
          done();
        }
        taskList.start();
      });

      it('should log ^ retry information even when no info is given', function (done){
        TaskList = f_.augment(TaskList, {
          function_flow: ['getSource', 'writeSource', 'notify'],
          to_log: ['retry']
        });

        var taskList = new TaskList({ retryFromOnceWithoutInfo: true });
        taskList = f_.setup(taskList);
        taskList.onRetry = function (){
          done();
        }
        taskList.start();
      });

    });


    describe('##retryThis', function (){
      it('should log ^ retryThis information', function (done){
        TaskList = f_.augment(TaskList, {
          function_flow: ['getSource', 'writeSource', 'notify'],
          to_log: ['retry']
        });

        var taskList = new TaskList({ retryThisOnce: true });
        taskList = f_.setup(taskList);
        taskList.onRetry = function (){
          done();
        }
        taskList.start();
      });

      it('should log ^ retryThis information even when no info is given', function (done){
        TaskList = f_.augment(TaskList, {
          function_flow: ['getSource', 'writeSource', 'notify'],
          to_log: ['retry']
        });

        var taskList = new TaskList({ retryThisOnceWithoutInfo: true });
        taskList = f_.setup(taskList);
        taskList.onRetry = function (){
          done();
        }
        taskList.start();
      });
    });


    describe('##retryMethod', function (){
      it('should log ^ retryMethod information', function (done){
        TaskList = f_.augment(TaskList, {
          function_flow: ['getSource', 'writeSource', 'notify'],
          to_log: ['retry']
        });

        var taskList = new TaskList({ retryMethodOnce: true });
        taskList = f_.setup(taskList);
        taskList.onFinish = done;
        taskList.start();
      });

      it('should log ^ retryMethod information even when no info is given', function (done){
        TaskList = f_.augment(TaskList, {
          function_flow: ['getSource', 'writeSource', 'notify'],
          to_log: ['retry']
        });

        var taskList = new TaskList({ retryMethodOnceWithoutInfo: true });
        taskList = f_.setup(taskList);
        taskList.onFinish = done;
        taskList.start();
      });

    });




  });


  describe('#abort', function (){

    it('should log ^ abort information', function (done){
      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify'],
        to_log: ['abort']
      });

      var taskList = f_.setup( new TaskList({ abort: true }) );
      taskList.onAbort = done
      taskList.start();
    });

    it('should log ^ the error stack', function (done){
      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify'],
        to_log: ['errStack']
      });

      var taskList = f_.setup( new TaskList({ abort: true }) );
      taskList.onAbort = done
      taskList.start();
    });


    it('should log ^ abort information even when no description is given' + hr, function (done){
      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify'],
        to_log: ['abort']
      });

      var taskList = f_.setup( new TaskList({ emptyAbortErr: true }) );
      taskList.onAbort = done
      taskList.start();
    });
  });


});

