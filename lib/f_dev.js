var Ezlog = require('Ezlog'),
		cls = require('opensoars_cls'),
		log = new Ezlog({pref:{t:'[f_]',c:'yellow'}}),
		logGreen = new Ezlog({pref:{t:'[f_]',c:'yellow'},text:{c:'green'}}),
		logRed = new Ezlog({pref:{t:['[f_]'],c:'yellow'},text: {c:'red'}});

var f_methods = {

	next: function next(){
		if(this.f_i === 0) this.f_startTime = new Date().getTime(); 

		if(this.f_i===0&&this.f_toLog.hasnt('silent')&&this.f_toLog.has('start'))
			logGreen('starting task');

		if(this.f_i === this.f_functionFlow.length)
			return this.f_finish();

		var methodName = this.f_functionFlow[this.f_i];

		if(this[methodName] && typeof this[methodName] === 'function'){

			if(this.f_toLog.hasnt('silent') && this.f_toLog.has('next'))
				log('next: ' + cls({ c: 'yellow', t: methodName}));

			this.f_i = this.f_i + 1;

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
		// So now we need to count every function call, should be np
	},

	abort: function abort(){
		if(this.f_toLog.hasnt('silent') && this.f_toLog.has('abort'))
			logRed('ABORT, more logging coming here!');

		if(this.onAbort) return this.onAbort();
	},

	finish: function finish(){

		this.f_endTime = new Date().getTime();
		this.f_timeTaken = this.f_endTime - this.f_startTime;

		if(this.f_toLog.hasnt('silent') && this.f_toLog.has('finish'))
			log(cls({c: 'green', t: 'Task complete,' }) + ' time taken: '
				+ cls({c: 'green', t: this.f_timeTaken }) + ' ms');
		
		if(this.onFinish) return this.onFinish();
	}

};


var f_toLogTriggers = ['start', 'next', 'retry', 'error', 'abort', 'finish'];


/**
 * Use this function to add properties/methods to the prototype object.
 * We want these to be shared between instances, saves some overhead.
 * @arg    toAugment {func/instance}
 * @return toAugment {func/instance}
 */
function augment(toAugment, config){
	toAugment = toAugment || undefined;

	// Throw is used since we cannot do anything with f_ if reqs aren't met!

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


	// Can't be looped, we need defaults!
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


	// Add methods and properties to Class it's prototype object

	for(var methodName in f_methods)
		toAugment.prototype['f_' + methodName] = f_methods[methodName];
	
	for(var propName in f_props)
		toAugment.prototype['f_' + propName] = f_props[propName];

	/**
	 * Helper functions which shorten f_toLog indexOf logic
	 * @arg    checkFor {string}
	 * @return          {bool}    whether it contains checkFor or not
	 */
	toAugment.prototype.f_toLog.has = function (checkFor){
		return toAugment.prototype.f_toLog.indexOf(checkFor) === -1 ? false : true;
	};

	toAugment.prototype.f_toLog.hasnt = function (checkFor){
		return toAugment.prototype.f_toLog.indexOf(checkFor) === -1 ? true : false;
	};


	if(toAugment.prototype.f_toLog.has('all')){
		toAugment.prototype.f_toLog.splice(0, 1);
		for(var i=0; i<f_toLogTriggers.length; i+=1)
			toAugment.prototype.f_toLog.push(f_toLogTriggers[i]);
	}

	return toAugment;
}

/**
 * Use this function to add properties/methods we want to be
 * unique for every instance. Can't be shared between instances (ofc)
 * @arg    f_instance {func/inst}  
 * @return f_instance {func/inst}  Configurated instance
 */
function setup(f_instance){

	f_instance[f_instance.f_errorArray] = [];
	f_instance[f_instance.f_dataNamespace] = {};

	f_instance.f_i = 0;

	f_instance.retries = {};

	for(var methodName in f_instance.f_functionFlow){}


	return f_instance;
}

module.exports = {
	augment: augment,
	setup: setup
};