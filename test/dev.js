var f_ = require(__dirname + './../index.js'),
    TaskList = require('./lib/TaskList.js');

/*
TaskList = f_.augment(TaskList, {
  functionFlow: ['getSource', 'writeSource', 'notify'],
  toLog: ['all'],
  desc: 'dev.js task list',
  maxTries: {
    wholeList: 2,
    getSource: '?',
    writeSource: '2',
    notify: '?'
  }
});


console.log(TaskList.prototype);


var taskList = new TaskList({
  //retryAllOnce: true
  //retryThisOnce: true
  //retryFromOnce: true
  //retryMethodOnceFromFirst: true
  //retryMethodOnceWithoutCb: true
});

taskList = f_.setup(taskList);

taskList.f_.onFinish = function (){
  console.log(' ! onFinish !');
  //console.log(this);
 // console.log(this);
};

taskList.start();

*/

TaskList = f_.augment(TaskList, {
  functionFlow: ['getSource', 'writeSource', 'notify'],
  toLog: ['all'],
  desc: 'logAll task list'
});

var taskList = new TaskList();
taskList = f_.setup(taskList);


taskList.onFinish = function (){

  for(var key in this){
    if(key.indexOf('f_') === -1)
      console.log(key);
  }

};

taskList.start();


/*
taskList.onRetry = function (info){
  //console.log(info);
};



taskList.onAbort = function (){
  //console.log('onAbort');
};


taskList.start();*/