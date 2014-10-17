var f_ = require(__dirname + './../index.js'),
    TaskList = require('./lib/TaskList.js');


TaskList = f_.augment(TaskList, {
  functionFlow: ['getSource', 'writeSource', 'notify'],
  toLog: ['all'],
  desc: 'dev.js task list',
  maxTries: {
    wholeList: 2,
    //allMethods: 5,
    getSource: '?',
    writeSource: 2,
    notify: '?'
  }
});


var taskList = new TaskList({
  //retryAllOnce: true
  //retryThisOnce: true
  //retryFromOnce: true
  //retryMethodOnceFromFirst: true
  //retryMethodOnceWithoutCb: true
});

taskList = f_.setup(taskList);

taskList.onFinish = function (){
  this.f_cleanup();

  console.log(this);
  console.log(this.__proto__);

};

taskList.start();
