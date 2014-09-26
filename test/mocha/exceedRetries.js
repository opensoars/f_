var assert = require('assert');

var f_ = require(__dirname + './../../index.js'),
    TaskList = require('./../lib/TaskList.js');

describe('#exceedRetries', function (){

  it('f_ should call onAbort', function (done){
    TaskList = f_.augment(TaskList, {
      functionFlow: ['getSource', 'writeSource', 'notify'],
      toLog: ['none']
    });

    taskList = new TaskList({ exceedRetries: true });
    taskList = f_.setup(taskList);
    taskList.onAbort = done;
    taskList.start();
  });

  it('should', function (done){
    TaskList = f_.augment(TaskList, {
      functionFlow: ['getSource', 'writeSource', 'notify'],
      toLog: ['none']
    });

    taskList = new TaskList({ exceedRetries: true });
    taskList = f_.setup(taskList);
    taskList.onAbort = function (){


      var retries = this.f_retries.all,
          maxRetries = TaskList.prototype.f_maxRetries.all;

      console.log(retries, maxRetries);

      done();

    };
    taskList.start();

  });

});