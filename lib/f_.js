/** f_ module dependencies
 * Just colorized logging related
 */
var Ezlog = require(__dirname + './../node_modules/ezlog'),
		cls = require(__dirname + './../node_modules/opensoars_cls'),
		log = new Ezlog({pref:{t:'[f_]',c:'yellow'}}),
		logGreen = new Ezlog({pref:{t:'[f_]',c:'yellow'},text:{c:'green'}}),
		logRed = new Ezlog({pref:{t:['[f_]'],c:'yellow'},text: {c:'red'}});

/** Global color helper functions to make cls calls in code unnecessary
 * @arg    t {string}  The text to color
 * @return   {string}  The colorized text
 */
function GREEN(t){  return cls({c: 'green',  t: t            }); }
function RED(t){    return cls({c: 'red',    t: t            }); }
function BLUE(t){   return cls({c: 'blue',   t: t, s: 'bold' }); }
function WHITE(t){  return cls({c: 'white',  t: t            }); }


/** All log triggers
 * These are added to f_toLog when ['all'] is specified
 *
 * @private
 */
var LOGTRIGGERS = ['start', 'next', 'retry', 'error', 'abort', 'errStack', 'finish'];

/** All f_ methods
 * Will be added to prototype object of toAugment (class) by
 * looping through the methods. Methods bill be prefixed w/ `f_`.
 */
var METHODS = {
	/** Used from within task: this.f_next();
	 * No arguments are given, since we set data to the namespace
	 * @public @private
	 */
	next: function next(){
		// Are we starting a task?
		if(this.f_i === 0 && this.f_hasInitialized === false){
			this.f_startTime = Date.now(); 
			this.f_hasInitialized = true;
		}

		if(this.f_i === 0) this.f_tries.all += 1;


		// Are we exceeding the maxTries.all ?
		if(this.f_tries.all > this.f_maxTries.all &&
			 this.f_tries.all !== '~')
				return this.f_abort('Max all tries exceeded',
					new Error('this.f_tries.all > this.f_maxTries.all'));


		if(this.f_i === 0 && this.f_toLog.has('start'))
			log('Starting task '
			+ (this.f_desc ? BLUE(' ' + this.f_desc) : '')
			+ '  Attempt ' + GREEN(this.f_tries.all)
			+ '/' + RED(this.f_maxTries.all));

		// Are we done with tasks from functionFlow? If yes finishx
		if(this.f_i === this.f_functionFlow.length)
			return this.f_finish();

		// Get methodName from functionFlow array
		var methodName = this.f_functionFlow[this.f_i];

		// Is the method actualy there? And is it a function ?
		if(this[methodName] && typeof this[methodName] === 'function'){

			// Increment try tries for a method, ALWAYS
			this.f_tries[methodName] += 1

			// If a maxTries is set for a certain method
			if(this.f_maxTries[methodName] && this.f_maxTries[methodName] !== '~'){

				// If the max tries for a certain method is exceeded abort
				if(this.f_tries[methodName] > this.f_maxTries[methodName] &&
					 this.f_maxTries[methodName] !== '~')
					return this.f_abort('`' + methodName + '` maxTries exceeded',
						'this.f_tries[methodName] > this.f_maxTries[methodName]');
			}


			// Logs method name. If maxTries is set for a method, log about attempts
			if(this.f_toLog.has('next')) log('next: ' + BLUE(methodName)
				+ '\tAttempt ' + GREEN(this.f_tries[methodName]) + '/'
				+ RED( this.f_maxTries[methodName])
			);

			this.f_i += 1;

			// When onNext is present, send it the currunt method and the f_i(ndex)
			if(this.onNext) this.onNext({ method: methodName, f_i: this.f_i });

			// Call the 'next' method
			return this[methodName]();
		}
		// If we can't call another function from functionFlow, ABORT!
		else return this.f_abort('no next function in functionFlow');
	},

	/** Simple namespace reset function
	 * Will be further edited to allow deeper object namespace saving
	 * whilst resetting the top level namespace
	 * @public @private
	 */
	resetNamespace: function resetNamespace(){
		this[this.f_dataNamespace] = {};
	},

	/** Retries all methods
	 * Will reset data if wanted
	 * Will reset f_i, starting with functionFlow[0]
	 * 
	 * @public
	 * @arg desc {string}  error description
	 * @arg err  {object}  node error
	 */
	retryAll: function retryAll(desc, err){

		if(this.f_toLog.has('retry')){
			log( RED('Retry') + (desc ? '  desc: ' + RED(desc) : '')
				+ (err  ? '  err: '  + RED(err)  : '') );
			console.log('');
		}
		
		this.f_addErr(desc, err);

		// Do we want a data namespace reset ?
		if(this.f_resetOnRetryAll) this.f_resetNamespace();


		if(this.onRetry) this.onRetry({
			type: 'retryAll',
			calledFrom: this.f_functionFlow[this.f_i - 1],
			tries: this.f_tries.all,
			maxTries: this.f_maxTries.all
		});

		// Reset f_i so we can retry whole functionFlow
		this.f_i = 0;

		return this.f_next();
	},

	/** Retries method where this method is called from
	 * Will carry on with functionFlow as if nothing happened
	 * Will increment maxTries.methodName
	 * NO auto data reset is done with this method! (can be done by user)
	 *
	 * @public
	 * @arg desc {string}  error description
	 * @arg err  {object}  node error
	 */
	retryThis: function retryThis(desc, err){

		this.f_addErr(desc, err);

		// Use this cuz f_ will make use of 'next' logic (maxTries)
		this.f_i -= 1;


		if(this.onRetry) this.onRetry({
			type: 'retryThis',
			calledFrom: this.f_functionFlow[this.f_i],
			tries: this.f_tries[this.f_functionFlow[this.f_i]],
			maxTries: this.f_maxTries[this.f_functionFlow[this.f_i]]
		});


		return this.f_next();
	},

	/** Helper function to add errors to f_errs array
	 *
	 * @public @private
	 * @arg desc {string}  error description
	 * @arg err  {object}  node error
	 */
	addErr: function addErr(desc, err){
		this.f_errs.push({ desc: (desc || ''), err: (err || {}) });
	},

	/** Error stack logger helper function
	 * Pretty prints the error stack
	 * Gets called from f_abort (if wanted)
	 *
	 * @public @private
	 */
	logErrStack: function logErrStack(){
		logRed('- f_errs -');
		this.f_errs.forEach(function (err){ console.log(err); });
		logRed('- f_errs -');
	},

	/** f_abort function
	 * Calls f_logErrStack if wanted
	 *
	 * @public @private
	 * @arg desc {string} error description
	 * @arg err  {object} node error
	 */
	abort: function abort(desc, err){
		this.f_endTime = Date.now();
		this.f_timeTaken = this.f_endTime - this.f_startTime;

		this.f_addErr('ABORT  ' + (desc || ''), (err  || {}));

		if(this.f_toLog.has('abort')){
			logRed('ABORT  ' + (desc ? 'desc: ' + WHITE(desc) : ''));
			logRed("Time taken: " + this.f_timeTaken.toString() + " ms");
		}

		if(this.f_toLog.has('errStack')) this.f_logErrStack();

		this.f_status = 'aborted'

		if(this.onAbort) return this.onAbort();
	},

	/** When we are done with f_ task this method gets called
	 * Calculate the time taken to complete the task
	 *
	 * @private
	 */
	finish: function finish(){
		this.f_endTime = Date.now();
		this.f_timeTaken = this.f_endTime - this.f_startTime;

		if(this.f_toLog.has('finish'))
			log(GREEN('finish') + '  time taken: '
				+ GREEN(this.f_timeTaken.toString()) + ' ms');

		this.f_status = 'finished'

		if(this.onFinish) return this.onFinish();
	}

};

/** f_.augment
 * Use this function to add properties/methods to the prototype object.
 * We want these to be shared between instances, saves some overhead.
 *
 * @public
 * @arg    toAugment {func/instance}
 * @return toAugment {func/instance}
 */
function augment(toAugment, config){
	toAugment = toAugment || undefined;

	// Throw is used since we cannot do anything with f_ if reqs aren't met!
	// So when augmenting and setting up, we will do that in a try catch
	if(!toAugment) throw '!toAugment Class|Object given';
	if(typeof toAugment !== 'function') throw 'wrong toAugment type, !function';
	if(!config) throw '!config  f_ needs config object';
	if(typeof config !== 'object') throw 'wrong config type, !object';
	if(!config.functionFlow)
		throw '!config.functionFlow, f_ needs to know which methods to call';
	if( (config.functionFlow instanceof Array) !== true) 
		throw 'wrong config.functionFlow type, !array';

	// Can't be looped, we need defaults!
	var props = {
		// NO DEFAULT, throw if not present
		functionFlow: config.functionFlow, 

		errorArray: config.errorArray || 'errs',
		dataNamespace: config.dataNamespace || 'd',

		desc: config.desc || '',
		toLog: config.toLog || [],

		// Object used because future might need more properties
		// We do no want to use camelcased naming!
		maxTries: config.maxTries || { all : 10 },

		resetOnRetryAll: config.resetOnRetryAll || false
	};


	// Maybe maxTries is specified, but all property is not there.
	// This makes sure it's always there. No matter what.
	if(!props.maxTries.all && props.maxTries.all !== 0)
		props.maxTries.all = 10;


	props.functionFlow.forEach(function (methodName){
		if(!props.maxTries[methodName]) props.maxTries[methodName] = '~';
	});


	// Make a copy of toAugment.prototype, store new properties in there.
	// Later we asign it back to toAugment its real prototype object
	var toAugmentProto = toAugment.prototype;

	// Add methods to Class it's prototype object
	for(var methodName in METHODS)
		toAugmentProto['f_' + methodName] = METHODS[methodName];
	
	// Add properties to Class it's prototype object
	for(var propName in props)
		toAugmentProto['f_' + propName] = props[propName];

	/**
	 * Helper functions which shortens f_toLog indexOf logic
	 *
	 * @private
	 * @arg    checkFor {string}
	 * @return          {bool}    whether it contains checkFor or not
	 */
	toAugmentProto.f_toLog.has = function (checkFor){
		return toAugmentProto.f_toLog.indexOf(checkFor) === -1 ? false : true;
	};

	// Add all triggers from LOGTRIGGERS if toLog === ['all']
	if(toAugmentProto.f_toLog.has('all')){
		toAugmentProto.f_toLog.splice(0, 1);

		LOGTRIGGERS.forEach(function (trigger){
			toAugmentProto.f_toLog.push(trigger);
		});
	};

	toAugment.prototype = toAugmentProto;

	return toAugment;
}

/** F_.setup
 * Use this function to add properties/methods we do not want to be
 * added to the prototype object but instead to a single instance.
 * Not used to set user data. Just further f_ setup.
 *
 * @ublic
 * @arg    instance {func/inst}  
 * @return instance {func/inst}  Configurated instance
 */
function setup(instance){

	if(!instance) throw 'no instance given';
	if(typeof instance !== 'object') throw "typeof instance !== 'object'";

	// Used to not overwrite startTime
	instance.f_hasInitialized = false;

	instance['f_' + instance.f_errorArray] = [];
	instance[instance.f_dataNamespace] = {};

	instance.f_i = 0;

	// unresolved, finished, aborted
	instance.f_status = 'unresolved';

	instance.f_tries = { all: 0 };

	for(var method in instance.f_maxTries)
		instance.f_tries[method] = 0;

	return instance;
}

module.exports = { augment: augment, setup: setup };