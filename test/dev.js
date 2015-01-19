var f_ = require(__dirname + './../index.js'),
    TaskList = require('./lib/TaskList.js');


TaskList = f_.augment(TaskList, {
  function_flow: ['getSource', 'writeSource', 'notify'],
  to_log: ['all'],
  desc: 'dev.js task list',
  max_tries: {
    whole_list: 2,
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
    
    taskList = this.f_cleanup();

  };

  taskList.start();

  i += 1;
  return run();

}());



