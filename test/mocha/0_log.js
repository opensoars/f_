/**
 * File is called 0_log.js because we don't want to have weird logging
 * inbetween the mocha logging
 * For readability, last `it` in this test should contain \n - - - - `hr`
 *
 * Logging can result in weird results because the f_ / cls / ezlog code is
 * not run in a synchronous way. This ofcourse is not wanted. But it CAN
 * produce logging in wrong order in this test suite. Just ignore it
 */

var hr = '\n\n - - - - - - - - - - - - - - - - - END `f_ logging`'
    + '- - - - - - - - - - - - - - - - - ';

var assert = require('assert');

var f_ = require(__dirname + './../../index.js'),
    TaskList = require('./../lib/TaskList.js');


describe('f_ logging', function (){

  describe('#start', function (){

    it('should log ^ about start (with blue desc)', function (){
      f_.setup( new (f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        toLog: ['start'],
        desc: 'f_ logging #start task list'
      })) ).start();
    });

    it('should log ^ about start (but no blue desc)', function (){
      f_.setup( new (f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        toLog: ['start']
      })) ).start();
    });

  });

  describe('#normal run', function (){

    it('should log ^ start next and finish', function (done){
      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        toLog: ['all'],
        desc: 'logAll task list'
      });

      var taskList = new TaskList();
      taskList = f_.setup(taskList);
      taskList.onFinish = done;
      taskList.start();
    });
    
  });


  describe('#infinite retries', function (){
    it('^ should not log /maxTries information just current try', function (done){

      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        toLog: ['all'],
        desc: 'logAll task list',
        maxTries: {
          wholeList: '?',
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
        functionFlow: ['getSource', 'writeSource', 'notify'],
        toLog: ['next'],
        maxTries: { writeSource: 2 }
      });

      var taskList = new TaskList();
      taskList = f_.setup(taskList);
      taskList.onFinish = done;
      taskList.start();
    });
  });


  describe('#retry', function (){

    it('should log ^ retry information when toLog[\'retry\'] is set', function (done){

      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        maxTries: { wholeList: 2 },
        toLog: ['retry']
      });

      var taskList = new TaskList({ retryAllOnce: true });
      taskList = f_.setup(taskList);
      taskList.onFinish = done;
      taskList.start();
    });

    it('should log ^ even when no details are given to log', function (done){

      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        maxTries: { wholeList: 2 },
        toLog: ['retry']
      });

      var taskList = new TaskList({ emptyRetryErr: true });
      taskList = f_.setup(taskList);
      taskList.onFinish = done;
      taskList.start();
    });
  });


  describe('#abort', function (){

    it('should log ^ abort information', function (done){
      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        toLog: ['abort']
      });

      var taskList = f_.setup( new TaskList({ abort: true }) );
      taskList.onAbort = done
      taskList.start();
    });

    it('should log ^ the error stack', function (done){
      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        toLog: ['errStack']
      });

      var taskList = f_.setup( new TaskList({ abort: true }) );
      taskList.onAbort = done
      taskList.start();
    });


    it('should log ^ abort information even when no description is given' + hr, function (done){
      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        toLog: ['abort']
      });

      var taskList = f_.setup( new TaskList({ emptyAbortErr: true }) );
      taskList.onAbort = done
      taskList.start();
    });
  });


});
