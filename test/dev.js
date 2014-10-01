var f_ = require(__dirname + './../index.js'),
    TaskList = require('./lib/TaskList.js');


TaskList = f_.augment(TaskList, {
  functionFlow: ['getSource', 'writeSource', 'notify'],
  toLog: ['all'],
  desc: 'dev.js task list',
  maxRetries: {
    all: 5,
    notify: 2
  }
});

var taskList = new TaskList({
  //retryAllOnce: true,
  retryThisOnce: true
});

taskList = f_.setup(taskList);

taskList.onRetry = function (info){

  console.log(info);

};

taskList.onFinish = function (){
  console.log('onFinish');
};

taskList.onAbort = function (){
  console.log('onAbort');
};


taskList.start();