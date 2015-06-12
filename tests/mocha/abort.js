var assert = require('assert');

var f_ = require(__dirname + './../../index.js'),
    TaskList = require('./../lib/TaskList.js');

describe('abort', function (){

  describe('#trigger abort: true', function (){

    it('f_ should call `onAbort`', function (done){

      TaskList = f_.setPrototype(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify']
      });

      var taskList = f_.setInstance( new TaskList({ abort: true }) );
      taskList.onAbort = done;
      taskList.start();
    });


    it('f_ should have set f_status to `aborted`', function (done){

      TaskList = f_.setPrototype(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify']
      });

      var taskList = f_.setInstance( new TaskList({ abort: true }) );

      taskList.onAbort = function (){
        assert.equal(this.f_status, 'aborted');
        done();
      };

      taskList.start();
    });

  });


  describe('#emptyErr', function (){
    it('f_ should be able to abort when no errors are given', function (done){

      TaskList = f_.setPrototype(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify']
      });

      var taskList = new TaskList({ emptyAbortErr: true });
      taskList = f_.setInstance(taskList);
      taskList.onAbort = done;
      taskList.start();
    });
  });

});

