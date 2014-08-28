var f_ = require('../index.js');

var TaskList = require('TaskList');


var f_config = {
	functionFlow: ['getSource', 'writeSource', 'notify']
};

TaskList = f_.augment(TaskList, f_config);

var taskListInstance = new TaskList();
taskListInstance = f_.setup(taskListInstance);

taskListInstance.start();
