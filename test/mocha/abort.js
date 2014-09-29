var assert = require('assert');

var f_ = require(__dirname + './../../index.js'),
    TaskList = require('./../lib/TaskList.js');

describe('abort', function (){

  describe('#trigger abort: true', function (){

    it('f_ should call `onAbort`', function (done){

      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify']
      });

      var taskList = f_.setup( new TaskList({ abort: true }) );
      taskList.onAbort = done;
      taskList.start();
    });


    it('f_ should have set f_status to `aborted`', function (done){

      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify']
      });

      var taskList = f_.setup( new TaskList({ abort: true }) );

      taskList.onAbort = function (){
        assert.equal(this.f_status, 'aborted');
        done();
      };

      taskList.start();
    });

  });


  describe('#emptyErr', function (){
    it('f_ should be able to abort when no errors are given', function (done){

      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify']
      });

      var taskList = new TaskList({ emptyAbortErr: true });
      taskList = f_.setup(taskList);
      taskList.onAbort = done;
      taskList.start();
    });
  });


  describe('#logging', function (){

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




    it('should log abort information even when no description is given ^ ^ ^'
      + '\n - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -', function (done){
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

