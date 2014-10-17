var f_ = require(__dirname + './../index.js'),
    TaskList = require('./lib/TaskList.js');


TaskList = f_.augment(TaskList, {
  functionFlow: ['getSource', 'writeSource', 'notify'],
  toLog: ['none'],
  desc: 'dev.js task list',
  maxTries: {
    wholeList: 2,
    //allMethods: 5,
    getSource: '?',
    writeSource: 2,
    notify: '?'
  }
});

var i = 0;
(function run(){

  if(i >= 5) return;



  var taskList = new TaskList({
    //retryAllOnce: true
    //retryThisOnce: true
    //retryFromOnce: true
    //retryMethodOnceFromFirst: true
    //retryMethodOnceWithoutCb: true,
    randomTimeout: true
  });

  taskList = f_.setup(taskList);

  taskList.f_desc = i;

  taskList.onFinish = function (){
    console.log(this.f_desc, this.f_timeTaken);

    this.f_cleanup();
  };

  taskList.start();


  i += 1;
  return run();

}());



