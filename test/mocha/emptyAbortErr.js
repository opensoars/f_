var assert = require('assert');

var f_ = require(__dirname + './../../index.js'),
    TaskList = require('./../lib/TaskList.js');

describe('emptyAbortErr', function (){

  it('f_ should be able to abort when no errors are given', function (done){

    TaskList = f_.augment(TaskList, {
      functionFlow: ['getSource', 'writeSource', 'notify']
    });

    var taskList = new TaskList({ emptyAbortErr: true });
    taskList = f_.setup(taskList);
    taskList.onAbort = done;
    taskList.start();
  });

  it('f_ should call `onAbort`', function (done){

    TaskList = f_.augment(TaskList, {
      functionFlow: ['getSource', 'writeSource', 'notify']
    });

    var taskList = new TaskList({ emptyAbortErr: true });
    taskList = f_.setup(taskList);
    taskList.onAbort = done;
    taskList.start();
  });


});