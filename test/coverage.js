var f_ = require(__dirname + './../index.js');

var TaskList = require('./lib/TaskList.js');


/* Test case # 1 #
 *
 * Retry once
 * succes
 */

var f_config = {

	functionFlow: ['getSource', 'writeSource', 'notify'],
	resetOnRetryAll: true,

	toLog: ['all'],

	desc: 'Test taskList,  retry, succes',

	maxRetries: {
		all: 2
	}
};

var TaskList = f_.augment(TaskList, f_config);

var taskList = new TaskList({
	retryOnce: true
});

taskList = f_.setup(taskList);

taskList.start();



/* Test case # 2 #
 *
 * abort
 */

f_config = {

	functionFlow: ['getSource', 'writeSource', 'notify'],
	resetOnRetryAll: false,

	toLog: ['all'],

	desc: 'Test taskList, abort',

	maxRetries: {
		all: 2
	}
};

TaskList = f_.augment(TaskList, f_config);

taskList = new TaskList({
	abort: true
});

taskList = f_.setup(taskList);

taskList.start();



/* Test case # 3 #
 *
 * Run normaly
 */

f_config = {

	functionFlow: ['getSource', 'writeSource', 'notify'],
	resetOnRetryAll: false,

	toLog: ['all'],

	desc: 'Test taskList, normal',

	maxRetries: {
		all: 2
	}
};

TaskList = f_.augment(TaskList, f_config);

taskList = new TaskList();

taskList = f_.setup(taskList);

taskList.start();



/* Test case # 4 #
 *
 * Log nothing
 */

f_config = {

	functionFlow: ['getSource', 'writeSource', 'notify'],
	resetOnRetryAll: false,

	toLog: ['silent'],

	desc: 'Test taskList, log nothing'
};

TaskList = f_.augment(TaskList, f_config);

taskList = new TaskList();

taskList = f_.setup(taskList);

taskList.start();



/* Test case # 5 #
 *
 * No description
 */

f_config = {

	functionFlow: ['getSource', 'writeSource', 'notify'],
	resetOnRetryAll: false,

	toLog: ['silent']
};

TaskList = f_.augment(TaskList, f_config);

taskList = new TaskList();

taskList = f_.setup(taskList);

taskList.start();



/* Test case # 6 #
 *
 * No next function for functionFlow (functionFlow: ['asd'])
 */

f_config = {

	functionFlow: ['asd'],

	toLog: ['silent']
};

TaskList = f_.augment(TaskList, f_config);

taskList = new TaskList();
taskList = f_.setup(taskList);

taskList.start();



/* Test case # 7 #
 *
 * Don't give onRetryAll
 * Don't give onNext
 * do not log about retry
 */

f_config = {
	functionFlow: ['getSource', 'writeSource', 'notify'],

	toLog: ['silent']

};

TaskList = f_.augment(TaskList, f_config);

taskList = new TaskList({
	retryOnce: true
});

taskList = f_.setup(taskList);

taskList.onRetryAll = undefined;
taskList.onNext = undefined;

taskList.start();



/* Test case # 8 #
 *
 * exceedRetries
 */

f_config = {
	functionFlow: ['getSource', 'writeSource', 'notify']
};

TaskList = f_.augment(TaskList, f_config);

taskList = new TaskList({
	exceedRetries: true
});

taskList = f_.setup(taskList);

taskList.start();



/* Test case # 9 #
 *
 * give emptyRetryErr
 */

f_config = {
	functionFlow: ['getSource', 'writeSource', 'notify']
};


TaskList = f_.augment(TaskList, f_config);

taskList = new TaskList({
	emptyRetryErr: true
});

taskList = f_.setup(taskList);

taskList.start();



/* Test case # 10 #
 *
 * give emptyAbortErr
 */

f_config = {
	functionFlow: ['getSource', 'writeSource', 'notify']
};

TaskList = f_.augment(TaskList, f_config);

taskList = new TaskList({
	emptyAbortErr: true
});

taskList = f_.setup(taskList);

taskList.start();



/* Test case # 11 #
 *
 * give give undefined toAugment type
 */

try {

	f_config = {
		functionFlow: ['getSource', 'writeSource', 'notify']
	};

	TaskList = f_.augment(undefined);

	taskList = new TaskList({
		emptyAbortErr: true
	});

	taskList = f_.setup(taskList);

	taskList.start();

} catch(e){}



/* Test case # 12 #
 *
 * give wrong toAugment type
 */

try {

	f_config = {
		functionFlow: ['getSource', 'writeSource', 'notify']
	};

	TaskList = f_.augment('wrong type');

	taskList = new TaskList({
		emptyAbortErr: true
	});

	taskList = f_.setup(taskList);

	taskList.start();

} catch(e){}



/* Test case # 13 #
 *
 * give no options
 */

try {

	f_config = {
		functionFlow: ['getSource', 'writeSource', 'notify']
	};

	TaskList = f_.augment(TaskList);

	taskList = new TaskList({
		emptyAbortErr: true
	});

	taskList = f_.setup(taskList);

	taskList.start();


} catch(e){}



/* Test case # 14 #
 *
 * give wrong options type
 */

try {

	f_config = {
		functionFlow: ['getSource', 'writeSource', 'notify']
	};

	TaskList = f_.augment(TaskList, 'wrong type');

	taskList = new TaskList({
		emptyAbortErr: true
	});

	taskList = f_.setup(taskList);

	taskList.start();

} catch(e){}





/* Test case # 15 #
 *
 * give no functionFlow
 */

try {

	f_config = {};

	TaskList = f_.augment(TaskList, f_config);

	taskList = new TaskList({
		emptyAbortErr: true
	});

	taskList = f_.setup(taskList);

	taskList.start();

} catch(e){}



/* Test case # 16 #
 *
 * give no functionFlow
 */

try {

	f_config = {
		functionFlow: []
	};

	TaskList = f_.augment(TaskList, f_config);

	taskList = new TaskList({
		emptyAbortErr: true
	});

	taskList = f_.setup(taskList);

	taskList.start();

} catch(e){}



/* Test case # 17 #
 *
 * give maxRetries. but NO all property
 */

f_config = {
	functionFlow: ['getSource', 'writeSource', 'notify'],

	maxRetries: {
		noAll: 10
	}
};

TaskList = f_.augment(TaskList, f_config);

taskList = new TaskList({
	emptyAbortErr: true
});

taskList = f_.setup(taskList);

taskList.start();



/* Test case # 18 #
 *
 * Don't give onFinish
 */

f_config = {
	functionFlow: ['getSource', 'writeSource', 'notify']
};

TaskList = f_.augment(TaskList, f_config);

taskList = new TaskList();

taskList = f_.setup(taskList);

taskList.onFinish = undefined;

taskList.start();



/* Test case # 19 #
 *
 * Don't give onFinish
 */

f_config = {
	functionFlow: ['getSource', 'writeSource', 'notify']
};

TaskList = f_.augment(TaskList, f_config);

taskList = new TaskList({
	abort: true
});

taskList = f_.setup(taskList);

taskList.onAbort = undefined;

taskList.start();



/** Test case # 20 #
 * Check if next will stop f_ if we retry a specific method
 * to many times
 * 
 * onRetryAll = undefined
 */

f_config = {
	functionFlow: ['getSource', 'writeSource', 'notify'],

	toLog: ['silent'],

	resetOnRetryAll: true,

	maxRetries: {
		all: 2
	},

	maxTries: {
		getSource: 1,
		writeSource: 1,
		notify: 1
	}

};

TaskList = f_.augment(TaskList, f_config);

taskList = new TaskList({
	retryAllOnce:  true
});

taskList = f_.setup(taskList);

taskList.onRetryAll = undefined;

taskList.start();



/** Test case # 21 #
 * retryThis
 */

f_config = {
	functionFlow: ['getSource', 'writeSource', 'notify'],

	maxTries: {
		getSource: 1,
		writeSource: 1,
		notify: 1
	}

};

TaskList = f_.augment(TaskList, f_config);

taskList = new TaskList({
	retryThis: true
});

taskList = f_.setup(taskList);

taskList.start();



/** Test case # 22 #
 * do not give retryThis
 */
f_config = {
	functionFlow: ['getSource', 'writeSource', 'notify'],

	maxTries: {
		getSource: 1,
		writeSource: 1,
		notify: 1
	}

};

TaskList = f_.augment(TaskList, f_config);

taskList = new TaskList({
	retryThis: true
});

taskList = f_.setup(taskList);

taskList.onRetryThis = undefined;

taskList.start();



/** Test case # 23 #
 * do not give taskList instance to f_.setup
 */

try {
	f_config = {
		functionFlow: ['getSource', 'writeSource', 'notify']
	};

	TaskList = f_.augment(TaskList, f_config);

	taskList = new TaskList({
		retryThis: true
	});

	taskList = f_.setup();

	taskList.start();
}
catch(e){}




/** Test case # 24 #
 * do not give taskList instance to f_.setup
 */

try {
	f_config = {
		functionFlow: ['getSource', 'writeSource', 'notify']
	};

	TaskList = f_.augment(TaskList, f_config);

	taskList = new TaskList();

	taskList = f_.setup('wrong type');

	taskList.start();
}
catch(e){}