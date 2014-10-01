var f_ = require(__dirname + './../index.js'),
    TaskList = require('./lib/TaskList.js');


TaskList = f_.augment(TaskList, {
  functionFlow: ['getSource', 'writeSource', 'notify'],
  toLog: ['all'],
  desc: 'dev.js task list',
  maxTries: {
    all: 5,
    writeSource: 2
  }
});

var taskList = new TaskList({
  //retryAllOnce: true,
  retryThisOnce: true
});

taskList = f_.setup(taskList);

taskList.onRetry = function (info){

  //console.log(info);

};

taskList.onFinish = function (){
  console.log('onFinish');
  console.log(this);
};

taskList.onAbort = function (){
  console.log('onAbort');
};


taskList.start();