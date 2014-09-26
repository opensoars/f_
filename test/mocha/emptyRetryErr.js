var assert = require('assert');

var f_ = require(__dirname + './../../index.js'),
    TaskList = require('./../lib/TaskList.js');

describe('#emptyRetryErr', function (){

  it('f_ should be able to retry when no errors are given', function (done){

    TaskList = f_.augment(TaskList, {
      functionFlow: ['getSource', 'writeSource', 'notify'],
      toLog: ['none']
    });

    taskList = new TaskList({ emptyRetryErr: true });
    taskList = f_.setup(taskList);
    taskList.onFinish = done;
    taskList.start();
  });

  it('f_ should call `onFinish`', function (done){

    TaskList = f_.augment(TaskList, {
      functionFlow: ['getSource', 'writeSource', 'notify'],
      toLog: ['none']
    });

    taskList = new TaskList({ emptyRetryErr: true });
    taskList = f_.setup(taskList);
    taskList.onFinish = done;
    taskList.start();
  });


});