var f_ = require('./../index.js'),
		TaskList = require('./lib/TaskList.js');

TaskList = f_.augment(TaskList, {
	functionFlow: ['getSource', 'writeSource', 'notify']  // REQUIRED
});


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

	for(var i=0; i<100000; i+=1)
		f_.setup(new TaskList()).start();

	console.log();
};


//runSingle();
runMultiple();

