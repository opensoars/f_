/**
 * requires `node --expose-gc`
 */


console.log("Memory usage on program start:\n", process.memoryUsage(), '\n');


var f_ = require('./../index.js');

var TaskList = require('./lib/TaskList.js');

var f_config = {

  /**
   * `start` method is not given here, since we call it manualy
   * This is just a matter of personal taste, I do not like auto starts!
   */
  functionFlow: ['getSource', 'writeSource', 'notify'],  // REQUIRED
  resetOnRetryAll: true,

  toLog: ['none'],

  desc: 'Test taskList',

  maxRetries: {
    all: 2
  },

  maxTries: {
    getSource: 1,
    writeSource: 2,
    notify: 1
  }

};

TaskList = f_.augment(TaskList, f_config);


var runSingle = function (){

  var taskListInstance = new TaskList({
    // Comment all triggers, and we run normaly
    //abort:         true,
    //exceedRetries: true,
    //retryAllOnce:  true
    //emptyRetryErr: true,  
    //emptyAbortErr: true,
    //retryMethod:   true,
    //retryThis:     true
  });


  taskListInstance = f_.setup(taskListInstance);

  taskListInstance.start();
};



var runMultiple = function (){
  var startTime = Date.now(); 

  var taskListCollection = [];

  for(var i=0; i<1000000; i+=1){
    taskListCollection[i] = new TaskList();
    taskListCollection[i] = f_.setup(taskListCollection[i]);

    taskListCollection[i].f_desc = taskListCollection[i].f_desc + ' #' + i;

    taskListCollection[i].start();
  }

  var endTime = Date.now(),
      timeTaken = endTime - startTime;

  console.log(timeTaken);

  console.log("Memory usage when everything has been run:\n", process.memoryUsage(), '\n');

  taskListCollection = [];

  console.log("Memory usage after clearing array:\n", process.memoryUsage(), '\n');

  prepareExit();

};


function prepareExit(){ 
  // run gc manualy
  global.gc();



  setTimeout(function (){

    console.log("Memory usage rdy to exit after gc():\n", process.memoryUsage(), '\n');

    console.log('Exiting in 5000ms');
    setTimeout(process.exit, 5000);


  }, 2500);




}


console.log("Memory usage when rdy to run:\n", process.memoryUsage(), '\n');

console.log('Starting in 2500ms');;
setTimeout(runMultiple, 2500);