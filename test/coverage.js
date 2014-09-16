var f_ = require('/../index.js');

var TaskList = require('./TaskList');



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

var f_config = {

	functionFlow: ['getSource', 'writeSource', 'notify'],
	resetOnRetryAll: false,

	toLog: ['all'],

	desc: 'Test taskList, abort',

	maxRetries: {
		all: 2
	}
};

var TaskList = f_.augment(TaskList, f_config);

var taskList = new TaskList({
	abort: true
});

taskList = f_.setup(taskList);

taskList.start();



/* Test case # 3 #
 *
 * Run normaly
 */

var f_config = {

	functionFlow: ['getSource', 'writeSource', 'notify'],
	resetOnRetryAll: false,

	toLog: ['all'],

	desc: 'Test taskList, normal',

	maxRetries: {
		all: 2
	}
};

var TaskList = f_.augment(TaskList, f_config);

var taskList = new TaskList();

taskList = f_.setup(taskList);

taskList.start();



/* Test case # 4 #
 *
 * Log nothing
 */

var f_config = {

	functionFlow: ['getSource', 'writeSource', 'notify'],
	resetOnRetryAll: false,

	toLog: ['silent'],

	desc: 'Test taskList, log nothing'
};

var TaskList = f_.augment(TaskList, f_config);

var taskList = new TaskList();

taskList = f_.setup(taskList);

taskList.start();



/* Test case # 5 #
 *
 * No description
 */

var f_config = {

	functionFlow: ['getSource', 'writeSource', 'notify'],
	resetOnRetryAll: false,

	toLog: ['silent']
};

var TaskList = f_.augment(TaskList, f_config);

var taskList = new TaskList();

taskList = f_.setup(taskList);

taskList.start();



/* Test case # 6 #
 *
 * No next function for functionFlow (functionFlow: ['asd'])
 */

var f_config = {

	functionFlow: ['asd'],

	toLog: ['silent']
};

var TaskList = f_.augment(TaskList, f_config);

var taskList = new TaskList();
taskList = f_.setup(taskList);

taskList.start();



/* Test case # 7 #
 *
 * Don't give onRetryAll
 * Don't give onNext
 * do not log about retry
 */

var f_config = {
	functionFlow: ['getSource', 'writeSource', 'notify'],

	toLog: ['silent']

};

var TaskList = f_.augment(TaskList, f_config);

var taskList = new TaskList({
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

var f_config = {
	functionFlow: ['getSource', 'writeSource', 'notify']
};

var TaskList = f_.augment(TaskList, f_config);

var taskList = new TaskList({
	exceedRetries: true
});

taskList = f_.setup(taskList);

taskList.start();



/* Test case # 9 #
 *
 * give emptyRetryErr
 */

var f_config = {
	functionFlow: ['getSource', 'writeSource', 'notify']
};


var TaskList = f_.augment(TaskList, f_config);

var taskList = new TaskList({
	emptyRetryErr: true
});

taskList = f_.setup(taskList);

taskList.start();



/* Test case # 10 #
 *
 * give emptyAbortErr
 */

var f_config = {
	functionFlow: ['getSource', 'writeSource', 'notify']
};

var TaskList = f_.augment(TaskList, f_config);

var taskList = new TaskList({
	emptyAbortErr: true
});

taskList = f_.setup(taskList);

taskList.start();



/* Test case # 11 #
 *
 * give give undefined toAugment type
 */

try {

	var f_config = {
		functionFlow: ['getSource', 'writeSource', 'notify']
	};

	var TaskList = f_.augment(undefined);

	var taskList = new TaskList({
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

	var f_config = {
		functionFlow: ['getSource', 'writeSource', 'notify']
	};

	var TaskList = f_.augment('wrong type');

	var taskList = new TaskList({
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

	var f_config = {
		functionFlow: ['getSource', 'writeSource', 'notify']
	};

	var TaskList = f_.augment(TaskList);

	var taskList = new TaskList({
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

	var f_config = {
		functionFlow: ['getSource', 'writeSource', 'notify']
	};

	var TaskList = f_.augment(TaskList, 'wrong type');

	var taskList = new TaskList({
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

	var f_config = {};

	var TaskList = f_.augment(TaskList, f_config);

	var taskList = new TaskList({
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

	var f_config = {
		functionFlow: []
	};

	var TaskList = f_.augment(TaskList, f_config);

	var taskList = new TaskList({
		emptyAbortErr: true
	});

	taskList = f_.setup(taskList);

	taskList.start();

} catch(e){}



/* Test case # 17 #
 *
 * give maxRetries. but NO all property
 */

var f_config = {
	functionFlow: ['getSource', 'writeSource', 'notify'],

	maxRetries: {
		noAll: 10
	}
};

var TaskList = f_.augment(TaskList, f_config);

var taskList = new TaskList({
	emptyAbortErr: true
});

taskList = f_.setup(taskList);

taskList.start();



/* Test case # 18 #
 *
 * Don't give onFinish
 */

var f_config = {
	functionFlow: ['getSource', 'writeSource', 'notify']
};

var TaskList = f_.augment(TaskList, f_config);

var taskList = new TaskList();

taskList = f_.setup(taskList);

taskList.onFinish = undefined;

taskList.start();



/* Test case # 19 #
 *
 * Don't give onFinish
 */

var f_config = {
	functionFlow: ['getSource', 'writeSource', 'notify']
};

var TaskList = f_.augment(TaskList, f_config);

var taskList = new TaskList({
	abort: true
});

taskList = f_.setup(taskList);

taskList.onAbort = undefined;

taskList.start();



/** Get 100% coverage
 * Future features
 */

var f_config = {
	functionFlow: ['getSource', 'writeSource', 'notify']
};

var TaskList = f_.augment(TaskList, f_config);

var taskList = new TaskList();

taskList = f_.setup(taskList);

taskList.onAbort = undefined;

taskList.start();

taskList.f_retryMethod();
taskList.f_retryFrom();
taskList.f_retryThis();