var assert = require('assert');


var f_ = require(__dirname + './../../index.js'),
    TaskList = require('./../lib/TaskList.js');


// Augment
TaskList = f_.augment(TaskList, {
  functionFlow: ['getSource', 'writeSource', 'notify'],
  toLog: ['none']
});


describe('#retryAllOnce', function (){

  it('should have set f_retries.all to 1', function (done){
    var taskList = f_.setup( new TaskList({ retryAllOnce: true }) );

    taskList.onFinish = function (){
      assert.equal(this.f_retries.all, 1);
      done();
    };

    taskList.start();
  });

});

