var assert = require('assert');

var f_ = require(__dirname + './../../index.js'),
    TaskList = require('./../lib/TaskList.js');


describe('functionFlow', function (){

  describe('#no next method', function (){
    it('should abort when there is no next method', function (done){

      TaskList = f_.augment(TaskList, {
        functionFlow: ['this is not a method']
      });

      var taskList = new TaskList();
      taskList = f_.setup(taskList);

      taskList.onAbort = done;

      taskList.start();

    });
  });

});