var assert = require('assert');

var f_ = require(__dirname + './../../index.js'),
    TaskList = require('./../lib/TaskList.js');


describe('#reset', function (){


  describe('#retryAllOnce', function (){
    it('should call onFinish', function (done){
      
      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        maxRetries: { all: 1 }
      });

      var taskList = new TaskList({ retryOnce: true });
      taskList = f_.setup(taskList);
      taskList.onFinish = done;
      taskList.start();

    });
  });



});