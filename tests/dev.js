var f_ = require('../index.js');

var TaskList = require('TaskList');


var f_config = {
	functionFlow: ['getSource', 'writeSource', 'notify'],  // REQUIRED
	toLog: ['all'],
	resetOnRetryAll: true,

	desc: 'Test taskList',

	maxRetries: {
		all: 2
	}
};

TaskList = f_.augment(TaskList, f_config);

runSingle = function (){
	var taskListInstance = new TaskList();
	taskListInstance = f_.setup(taskListInstance);

	taskListInstance.start();

}();

runMultiple = function (){
	for(var i=0; i<100; i+=1){
		var taskListInstance = new TaskList();
		taskListInstance = f_.setup(taskListInstance);

		taskListInstance.desc = taskListInstance.desc + i;

		taskListInstance.start();
	}
};
