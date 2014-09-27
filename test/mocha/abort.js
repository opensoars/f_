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


  describe('#logging', function (){
    it('should log abort information and the error stack ^ ^ ^', function (done){
      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        toLog: ['abort']
      });

      var taskList = f_.setup( new TaskList({ abort: true }) );
      taskList.onAbort = done
      taskList.start();
    });
  });




});

