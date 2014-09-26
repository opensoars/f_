var assert = require('assert');

var f_ = require(__dirname + './../../index.js'),
    TaskList = require('./../lib/TaskList.js');

describe('#normal', function (){

  it('f_ should have set f_status to `finished`', function (done){

    TaskList = f_.augment(TaskList, {
      functionFlow: ['getSource', 'writeSource', 'notify'],
      toLog: ['none']
    });

    var taskList = f_.setup( new TaskList() );

    taskList.onFinish = function (){
      assert.equal(this.f_status, 'finished');
      done();
    };

    taskList.start();
  });

  it('f_ should not throw', function (){

    TaskList = f_.augment(TaskList, {
      functionFlow: ['getSource', 'writeSource', 'notify'],
      toLog: ['none']
    });

    f_.setup( new TaskList() ).start();
  });

  it('f_ should call onFinish', function (done){

    TaskList = f_.augment(TaskList, {
      functionFlow: ['getSource', 'writeSource', 'notify'],
      toLog: ['none']
    });

    var taskList = f_.setup( new TaskList() );

    taskList.onFinish = done

    taskList.start();
  });


});