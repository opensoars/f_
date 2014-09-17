/** f_ module dependencies
 * Mainly colorized logging related
 */
var Ezlog = require(__dirname + '/../node_modules/ezlog'),
		cls = require(__dirname + '/../node_modules/opensoars_cls'),
		log = new Ezlog({pref:{t:'[f_]',c:'yellow'}}),
		logGreen = new Ezlog({pref:{t:'[f_]',c:'yellow'},text:{c:'green'}}),
		logRed = new Ezlog({pref:{t:['[f_]'],c:'yellow'},text: {c:'red'}});


/** Color helper functions
 * Makes cls calls in code unnecessary
 * @arg    t {string}  The text to color
 * @return   {string}  The colorized text
 */
function GREEN(t){  return cls({c: 'green',  t: t            }); }
function RED(t){    return cls({c: 'red',    t: t            }); }
function BLUE(t){   return cls({c: 'blue',   t: t, s: 'bold' }); }
function YELLOW(t){ return cls({c: 'yellow', t: t, s: 'bold' }); }
function WHITE(t){  return cls({c: 'white',  t: t            }); }

var f_methods = {

	/** Used from within task: this.f_next();
	 * No arguments are given, since we set data to the namespace
	 * @public
	 */
	next: function next(){

		if(this.f_i === 0 && this.f_hasInitialized === false){
			this.f_startTime = Date.now(); 
			this.f_hasInitialized = true;
		}


		if(this.f_i === 0 && this.f_toLog.has('start'))
			log('Starting task '
			+ (this.f_desc ? BLUE(' ' + this.f_desc) : '')
			+ '  Attempt ' + GREEN(this.f_retries.all + 1)
			+ ' of max ' + RED(this.f_maxRetries.all+ 1) + ' attempts');


		// Are we done with tasks from functionFlow? If yes finishx
		if(this.f_i === this.f_functionFlow.length)
			return this.f_finish();


		// Get methodName from functionFlow array
		var methodName = this.f_functionFlow[this.f_i];



		// Is the method actualy there? And is it a function ?
		if(this[methodName] && typeof this[methodName] === 'function'){

			// COMMENT THIS STUFF
			if(this.f_maxTries[methodName] && 
				(this.f_tries[methodName] || this.f_tries[methodName] === 0)){

				// COMMENT THIS STUFF
				if(this.f_tries[methodName] >= this.f_maxTries[methodName])
					return this.f_abort(methodName + ' maxTries exceeded');
				
				this.f_tries[methodName] += 1

			}


			if(this.f_toLog.has('next')) log('next: ' + YELLOW(methodName));

			this.f_i += 1;

			// When onNext is present, send it the currunt method and the f_ i(ndex)
			if(this.onNext) this.onNext({ method: methodName, f_i: this.f_i });

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

		this.f_retries.all += 1;

		// Are we exceeding the maxRetries.all ?
		if(this.f_retries.all > this.f_maxRetries.all)
			return this.f_abort('Max retries used',
				new Error('this.f_maxRetries.all > this.f_retries.all'));

		// Do we want a data namespace reset ?
		if(this.f_resetOnRetryAll)
			this.f_resetNamespace();

		// Reset f_i so we can retry whole functionFlow
		this.f_i = 0;

		if(this.onRetryAll) this.onRetryAll();

		return this.f_next();
	},

	// !CHECK IF WE NEED THIS! \\
	/** Retries a single method without interfering with functionFlow
	 * FIRST CHECK IF WE'RE ACTUALY GOING TO NEED THIS METHOD!!!!!
	 * Can be used to retry a specific task if data isn't present
	 * without method retries that aren't required
	 * NO auto data reset is done with this method! (can be done by user)
	 *
	 * @public
	 * @arg method {string}    method to retry functionFlow from
	 * @arg cb     {function}  function to call when we're done
	 * @arg desc   {string}    error description                  optional
	 * @arg err    {object}    node error                         optional
	 *//*
	retryMethod: function retryMethod(method, cb, desc, err){
		if(!method) return this.f_next();
	},*/

	// !CHECK IF WE NEED THIS! \\
	/** Retries a method and carries on from there
	 * FIRST CHECK IF WE'RE ACTUALY GOING TO NEED THIS METHOD!!!!!
	 * NO auto data reset is done with this method! (can be done by user)
	 *
	 * @public
	 * @arg from {string}  method to retry functionFlow from
	 * @arg desc {string}  error description
	 * @arg err  {object}  node error
	 *//*
	retryFrom: function retryFrom(from, desc, err){

		if(this.f_toLog.has('retry'))
			log( RED('Retry') + (desc ? '  desc: ' + RED(desc) : '')
				+ (err  ? '  err: '  + RED(err)  : '') );

		var fromIndex = this.f_functionFlow.indexOf(from);

		// Is our 'from' method present in functionFlow?
		if(this.f_functionFlow[fromIndex]){

			console.log('this.f_maxRetries     ', this.f_maxRetries);
			console.log('');
			console.log('this.f_maxTries       ', this.f_maxTries);
			console.log('this.f_maxTries[from] ', this.f_maxTries[from]);
			console.log('');
			console.log('this.f_tries          ', this.f_tries);
			console.log('this.f_tries[from]    ', this.f_tries[from]);

			// If specific method max isn't there, just use no limits!
			// only the maxRetries.from limit
			// So we won't use from limit when it's present

			if(this.f_tries[from] || this.f_tries[from] === 0){
				this.f_tries[from] += 1;
			}

			else{
				if(this.f_maxRetries.from || this.f_tries[from] === 0){
				}
			}

		}


		// (desc || ''), (err  || {})
	},*/


	/** Retries method where this method is called from
	 * Will carry on with functionFlow as if nothing happened
	 * Will increment maxTries
	 * NO auto data reset is done with this method! (can be done by user)
	 *
	 * @public
	 * @arg desc {string}  error description
	 * @arg err  {object}  node error
	 */
	retryThis: function retryThis(){



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
		console.log(''); logRed('- - START f_errs - -');
		for(var i=0; i<this.f_errs.length; i+=1)
			console.log(this.f_errs[i]);
		logRed('- - END   f_errs - -'); console.log('');
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

		this.f_addErr('Abort, desc: ' + (desc || ''), (err  || {}));

		if(this.f_toLog.has('abort')){
			logRed('ABORT' + (desc ? ', desc: ' + WHITE(desc) : ''));
			logRed("Time 'wasted': " + this.f_timeTaken.toString() + " ms");
			logRed('f_errs stack below');
			this.f_logErrStack();
		}

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

		if(this.onFinish) return this.onFinish();
	}

};


/** All log triggers
 * These are added to f_toLog when ['all'] is specified
 *
 * @private
 */
var f_toLogTriggers = ['start', 'next', 'retry', 'error', 'abort', 'finish'];


/**
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
		dataNamespace: config.dataNamespace || 'd',

		maxRetries: config.maxRetries || { all : 10 },
		maxTries: config.maxTries || {},

		maxMethodRetriesByName: config.maxMethodRetriesByName || {},
		toLog: config.toLog || ['all'],


		functionFlow: config.functionFlow, // NO DEFAULT, since we throw if it's not there

		desc: config.desc || '',

		resetOnRetryAll: config.resetOnRetryAll || false
	};


	/**
	 * Maybe maxRetries is specified, but all property is not there.
	 * This makes sure it's always there. No matter what.
	 */
	if(!f_props.maxRetries.all) f_props.maxRetries.all = 10;

	// Same goes for .from NOT USED YET
	//if(!f_props.maxRetries.from) f_props.maxRetries.from = 10;


	/**
	 * Make a copy of toAugment.prototype, store new properties in there.
	 * Later we asign it back to toAugment its real prototype object
	 */
	var toAugmentProto = toAugment.prototype;


	// Add methods to Class it's prototype object
	for(var methodName in f_methods)
		toAugmentProto['f_' + methodName] = f_methods[methodName];
	
	// Add properties to Class it's prototype object
	for(var propName in f_props)
		toAugmentProto['f_' + propName] = f_props[propName];


	/**
	 * Helper functions which shorten f_toLog indexOf logic
	 *
	 * @private
	 * @arg    checkFor {string}
	 * @return          {bool}    whether it contains checkFor or not
	 */
	toAugmentProto.f_toLog.has = function (checkFor){
		return toAugmentProto.f_toLog.indexOf(checkFor) === -1 ? false : true;
	};


	// Add all triggers from f_toLogTriggers if toLog === ['all']
	if(toAugmentProto.f_toLog.has('all')){
		toAugmentProto.f_toLog.splice(0, 1);
		for(var i=0; i<f_toLogTriggers.length; i+=1)
			toAugmentProto.f_toLog.push(f_toLogTriggers[i]);
	};

	toAugment.prototype = toAugmentProto;


	return toAugment;
}

/**
 * Use this function to add properties/methods we want to be
 * unique for every instance. Can't be shared between instances (ofc)
 *
 * @ublic
 * @arg    instance {func/inst}  
 * @return instance {func/inst}  Configurated instance
 */
function setup(instance){

	instance.f_hasInitialized = false;

	instance['f_' + instance.f_errorArray] = [];
	instance[instance.f_dataNamespace] = {};

	instance.f_i = 0;


	instance.f_retries = {
		all: 0,
		from: 0
	};


	instance.f_tries = {};
	for(var key in instance.f_maxTries) instance.f_tries[key] = 0;
	
	for(var methodName in instance.f_functionFlow){}

	return instance;
}

module.exports = {
	augment: augment,
	setup: setup
};