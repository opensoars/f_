/**
 * File is called 0_log.js because we don't want to have weird logging
 * inbetween the mocha logging
 * For readability, last `it` in this test should contain \n - - - - `hr`
 */

var hr = '\n\n - - - - - - - - - - - - - - - - - END `f_ logging`'
    + '- - - - - - - - - - - - - - - - - ';

var assert = require('assert');

var f_ = require(__dirname + './../../index.js'),
    TaskList = require('./../lib/TaskList.js');


describe('f_ logging', function (){

  describe('#start', function (){

    it('should log about start ^ ^ ^ (with blue desc)', function (){
      f_.setup( new (f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        toLog: ['start'],
        desc: 'f_ logging #start task list'
      })) ).start();
    });

    it('should log about start ^ ^ ^  (but no blue desc)', function (){
      f_.setup( new (f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        toLog: ['start']
      })) ).start();
    });

  });

  describe('#normal run', function (){

    it('should log start next and finish ^ ^ ^', function (done){
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


  describe('#retry', function (){

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


  describe('#abort', function (){

    it('should log abort information ^ ^ ^', function (done){
      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        toLog: ['abort']
      });

      var taskList = f_.setup( new TaskList({ abort: true }) );
      taskList.onAbort = done
      taskList.start();
    });

    it('should log the error stack  ^ ^ ^', function (done){
      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        toLog: ['errStack']
      });

      var taskList = f_.setup( new TaskList({ abort: true }) );
      taskList.onAbort = done
      taskList.start();
    });


    it('should log abort information even when no description is given ^ ^ ^', function (done){
      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        toLog: ['abort']
      });

      var taskList = f_.setup( new TaskList({ emptyAbortErr: true }) );
      taskList.onAbort = done
      taskList.start();
    });
  });


  describe('#method attempts', function (){
    it('should log about method attempts' + hr, function (done){
      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        toLog: ['next'],
        maxRetries: {
          writeSource: 1
        }
      });

      var taskList = new TaskList();
      taskList = f_.setup(taskList);
      taskList.onFinish = done;
      taskList.start();
    });
  });


});
