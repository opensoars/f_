var assert = require('assert');

var f_ = require(__dirname + './../../index.js'),
    TaskList = require('./../lib/TaskList.js');



describe('cleanup', function (){
  it('should clean the __proto__', function (done){
    TaskList = f_.augment(TaskList, {
      functionFlow: ['getSource', 'writeSource', 'notify']
    });

    var taskList = new TaskList();
    taskList = f_.setup(taskList);
    taskList.onFinish = function (){
      this.f_cleanup();
      assert.equal(this.__proto__, null);
      done();
    };
    taskList.start();
  });

  it('should have 0 own properties', function (done){
    TaskList = f_.augment(TaskList, {
      functionFlow: ['getSource', 'writeSource', 'notify']
    });

    var taskList = new TaskList();
    taskList = f_.setup(taskList);
    taskList.onFinish = function (){
      this.f_cleanup();
      var props = 0; for(var prop in this) props += 1;
      assert.equal(props, 0);
      done();
    };
    taskList.start();
  });

});