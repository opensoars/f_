var assert = require('assert');

var f_ = require(__dirname + './../../index.js'),
    TaskList = require('./../lib/TaskList.js');

describe('noNextFunctionflow', function (){

  it('f_ should not fail when there is no next function for `functionFlow`', function (){

    f_.setup( new (f_.augment(TaskList, {
      functionFlow: ['asd'],
      toLog: ['none']
    })) ).start();

  });

  it('f_ should set f_status to `aborted`', function (done){

    TaskList = f_.augment(TaskList, {
      functionFlow: ['asd'],
      toLog: ['none']
    });

    var taskList = f_.setup( new TaskList() );

    taskList.onAbort = function (){
      assert.equal(this.f_status, 'aborted');
      done();
    };

    taskList.start();

  });


  it('f_ should call `onAbort`', function (done){

    TaskList = f_.augment(TaskList, {
      functionFlow: ['asd'],
      toLog: ['none']
    });

    var taskList = f_.setup( new TaskList() );
    taskList.onAbort = done();
    taskList.start();

  });


});