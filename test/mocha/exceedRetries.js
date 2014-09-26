var assert = require('assert');

var f_ = require(__dirname + './../../index.js'),
    TaskList = require('./../lib/TaskList.js');

describe('exceedRetries', function (){

  it('f_ should call `onAbort`', function (done){
    TaskList = f_.augment(TaskList, {
      functionFlow: ['getSource', 'writeSource', 'notify'],
      toLog: ['none']
    });

    taskList = new TaskList({ exceedRetries: true });
    taskList = f_.setup(taskList);
    taskList.onAbort = done;
    taskList.start();
  });

  it('`(f_.retries.all - 1)` should be equal to `maxRetries`', function (done){
    TaskList = f_.augment(TaskList, {
      functionFlow: ['getSource', 'writeSource', 'notify'],
      toLog: ['none']
    });

    taskList = new TaskList({ exceedRetries: true });
    taskList = f_.setup(taskList);

    taskList.onAbort = function (){
      assert.equal( (this.f_retries.all - 1) , TaskList.prototype.f_maxRetries.all);
      done();
    };
    taskList.start();

  });

});