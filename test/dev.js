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


function runSingle(){

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


function runMultiple(){
	var startTime = Date.now(); 

	for(var i=0; i<100000; i+=1){
		var taskListInstance = new TaskList();
		taskListInstance = f_.setup(taskListInstance);

		taskListInstance.f_desc = taskListInstance.f_desc + ' #' + i;

		taskListInstance.start();
	}

	var endTime = Date.now(),
			timeTaken = endTime - startTime;

	console.log(timeTaken);

	debugger;

};


//runSingle();
runMultiple();