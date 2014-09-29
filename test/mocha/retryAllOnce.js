// PUT IN retry.js

var assert = require('assert');

var f_ = require(__dirname + './../../index.js'),
    TaskList = require('./../lib/TaskList.js');

describe('retryAllOnce', function (){

  it('f_ should have set f_retries.all to `1`', function (done){

    TaskList = f_.augment(TaskList, {
      functionFlow: ['getSource', 'writeSource', 'notify']
    });

    var taskList = f_.setup( new TaskList({ retryAllOnce: true }) );

    taskList.onFinish = function (){
      assert.equal(this.f_retries.all, 1);
      done();
    };

    taskList.start();
  });

  it('f_ should have set f_status to `finished`', function (done){

    TaskList = f_.augment(TaskList, {
      functionFlow: ['getSource', 'writeSource', 'notify'],
      toLog: ['none']
    });

    var taskList = f_.setup( new TaskList({ retryAllOnce: true }) );

    taskList.onFinish = function (){
      assert.equal(this.f_status, 'finished');
      done();
    };

    taskList.start();
  });

  it('f_ should call `onFinish`', function (done){

    TaskList = f_.augment(TaskList, {
      functionFlow: ['getSource', 'writeSource', 'notify']
    });

    var taskList = f_.setup( new TaskList({ retryAllOnce: true }) );
    taskList.onFinish = done;
    taskList.start();
  });

});

