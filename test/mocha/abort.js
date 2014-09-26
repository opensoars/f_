var assert = require('assert');

var f_ = require(__dirname + './../../index.js'),
    TaskList = require('./../lib/TaskList.js');

describe('abort', function (){

  it('f_ should call `onAbort`', function (done){

    TaskList = f_.augment(TaskList, {
      functionFlow: ['getSource', 'writeSource', 'notify'],
      toLog: ['none']
    });

    var taskList = f_.setup( new TaskList({ abort: true }) );
    taskList.onAbort = done;
    taskList.start();
  });


  it('f_ should have set f_status to `aborted`', function (done){

    TaskList = f_.augment(TaskList, {
      functionFlow: ['getSource', 'writeSource', 'notify'],
      toLog: ['none']
    });

    var taskList = f_.setup( new TaskList({ abort: true }) );

    taskList.onAbort = function (){
      assert.equal(this.f_status, 'aborted');
      done();
    };

    taskList.start();
  });

});

