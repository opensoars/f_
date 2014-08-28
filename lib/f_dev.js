var Ezlog = require('Ezlog');

var log = new Ezlog({
	pref: { t: '[f_]', c: 'yellow' }, text: { c: 'white' }
});

var logGreen = new Ezlog({
	pref: { t: '[f_]', c: 'yellow' }, text: { c: 'green' }
});

var logRed = new Ezlog({
	pref: { t: ['f_'], c: 'yellow' }, text: { c: 'red' }
});

var f_methods = {

	next: function next(){
		if(this.next_i === 0 && this.f_toLog.indexOf('silent') === -1)
			logGreen('starting task');

		if(this.next_i === this.f_functionFlow.length)
			return this.f_finish();

		var methodName = this.f_functionFlow[this.next_i];

		if(this[methodName] && typeof this[methodName] === 'function'){

			if(this.f_toLog.indexOf('all') !== -1
				 || this.f_toLog.indexOf('next') !== -1)
				log('next: ' + methodName);

			this.next_i = this.next_i + 1;

			return this[methodName]();
		}
		else return this.f_abort('no next function in functionFlow');

	},

	retryAll: function retryAll(){

		// If wanted do a reset here!

	},

	retryMethod: function retryMethod(){

	},

	retryFrom: function retryFrom(){

	},

	retryThis: function retryThis(){

	},

	abort: function abort(){
		logRed('ABORT');

		if(this.onAbort) return this.onAbort();
	},

	finish: function finish(){

		if(this.f_toLog.indexOf('silent') === -1)
			logGreen('task complete');

		if(this.onFinish) return this.onFinish();
	}

};

function augment(toAugment, config){
	toAugment = toAugment || undefined;

	if(!toAugment)
		throw '!toAugment Class|Object given';

	if(typeof toAugment !== 'function')
		throw 'wrong toAugment type, !function';

	if(!config)
		throw '!config  f_ needs config object';

	if(typeof config !== 'object')
		throw 'wrong config type, !object';

	if(!config.functionFlow)
		throw '!config.functionFlow, f_ needs to know which methods to call';

	if(!config.functionFlow.length)
		throw 'wrong config.functionFlow type, !array OR no method names given';


	var f_props = {
		errorArray: config.errorArray || 'errs',
		resetOnRetry: config.resetOnRetry || true,
		dataNamespace: config.dataNamespace || 'd',
		maxTotalRetries: config.maxTotalRetries || 10,
		maxMethodRetries: config.maxMethodRetries || 10,
		maxMethodRetriesByName: config.maxMethodRetriesByName || {},
		toLog: config.toLog || ['all'],
		functionFlow: config.functionFlow || []
	};

	for(var methodName in f_methods)
		toAugment.prototype['f_' + methodName] = f_methods[methodName];
	
	for(var propName in f_props)
		toAugment.prototype['f_' + propName] = f_props[propName];


	return toAugment;
}

function setup(toSetup){

	toSetup[toSetup.f_errorArray] = [];
	toSetup[toSetup.f_dataNamespace] = {};

	toSetup.next_i = 0;
	toSetup.totalTries = 0;

	return toSetup;
}

module.exports = {
	augment: augment,
	setup: setup
};