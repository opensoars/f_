var f_ = require('../index.js');

var TaskList = require('./TaskList');

var f_config = {
	functionFlow: ['getSource', 'writeSource', 'notify'],  // REQUIRED
	resetOnRetryAll: true,

	toLog: ['all'],

	desc: 'Test taskList',

	maxRetries: {
		all: 2
	}
};

TaskList = f_.augment(TaskList, f_config);

var runSingle = function (){
	var taskListInstance = new TaskList();
	taskListInstance = f_.setup(taskListInstance);

	taskListInstance.start();
}();

var runMultiple = function (){
	var startTime = Date.now(); 

	for(var i=0; i<10000; i+=1){
		var taskListInstance = new TaskList();
		taskListInstance = f_.setup(taskListInstance);

		taskListInstance.f_desc = taskListInstance.f_desc + ' #' + i;

		taskListInstance.start();
	}
	var endTime = Date.now(),
			timeTaken = endTime - startTime;

	console.log(timeTaken);
};
