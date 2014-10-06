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

    if(this.f_i === 0) this.f_tries.wholeList += 1;

    // Are we exceeding the maxTries.wholeList ?
    if(this.f_tries.wholeList > this.f_maxTries.wholeList &&
       this.f_tries.wholeList !== '?')
        return this.f_abort('Max all tries exceeded',
          new Error('this.f_tries.wholeList > this.f_maxTries.wholeList'));


    if(this.f_i === 0 && !this.f_retryMethodCall && this.f_toLog.has('start'))
      log('Starting task '
        + (this.f_desc ? BLUE(' ' + this.f_desc) : '')
        + '  Attempt ' + GREEN(this.f_tries.wholeList)
        + (this.f_maxTries.wholeList !== '?'
          ? '/' + RED(this.f_maxTries.wholeList) : '')
      );

    // Are we done with tasks from functionFlow? If yes finish
    if(this.f_i === this.f_functionFlow.length)
      return this.f_finish();


    // Get method from functionFlow array
    var method = this.f_functionFlow[this.f_i];

    // Is the method actualy there? And is it a function ?
    if(this[method] && typeof this[method] === 'function'){

      // Increment try tries for a method, ALWAYS
      this.f_tries[method] += 1

      // If a maxTries is set for a certain method
      if(this.f_maxTries[method] && this.f_maxTries[method] !== '?'){

        // If the max tries for a certain method is exceeded abort
        if(this.f_tries[method] > this.f_maxTries[method] &&
           this.f_maxTries[method] !== '?')
          return this.f_abort('`' + method + '` maxTries exceeded',
            'this.f_tries[method] > this.f_maxTries[method]');
      }


      // Logs method name. If maxTries is set for a method, log about tries
      if(this.f_toLog.has('next')) log('next: ' + BLUE(method)
        + '\tAttempt ' + GREEN(this.f_tries[method])
        + (this.f_maxTries[method] !== '?'
            ?  '/' + RED( this.f_maxTries[method]) : '')
      );

      // Are we in a retryMethod call?
      if(this.f_retryMethodCall && (this.old_f_i || this.old_f_i === 0)){

        // Set f_i to the saved old value of f_i
        this.f_i = this.old_f_i;

        // Set retryMethod properties back to undefined
        this.f_retryMethodCall = undefined;
        this.old_f_i = undefined;

        if(this.onNext) this.onNext({ method: method, f_i: this.f_i });

        // Is a callback set when retryMethod completes a method?
        // If it's not set, continue f_ task list as normal (f_next)
        if(this.f_retryMethodCb) return this.f_retryMethodCb();
        else return this.f_next();
      }

      this.f_i += 1;

      // When onNext is present, send it the currunt method and the f_i(ndex)
      if(this.onNext) this.onNext({ method: method, f_i: this.f_i });

      // Call the 'next' method
      return this[method]();
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

  /** Helper function to add errors to f_errs array
   *
   * @public @private
   * @arg desc {string}  Error description
   * @arg err  {Error}   Node error
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

  /** Retries all methods
   * Will reset data if wanted
   * Will reset f_i, starting with functionFlow[0]
   * 
   * @public
   * @arg desc {string} opt.  Error description
   * @arg err  {Error}  opt.  Node error
   */
  retryAll: function retryAll(desc, err){

    if(desc || err) this.f_addErr(desc, err);

    if(this.f_toLog.has('retry'))
      logRed('retryAll' + (desc ? '  desc: ' + WHITE(desc) : ''))

    // Do we want a data namespace reset ?
    if(this.f_resetOnRetryAll) this.f_resetNamespace();


    if(this.onRetry) this.onRetry({
      type: 'retryAll',
      calledFrom: this.f_functionFlow[this.f_i - 1],
      tries: this.f_tries,
      maxTries: this.f_maxTries
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
   * @arg desc {string} opt.  Error description
   * @arg err  {Error}  opt.  Node error
   */
  retryThis: function retryThis(desc, err){

    if(desc || err) this.f_addErr(desc, err);

    // Use this cuz f_ will make use of 'next' logic (maxTries)
    this.f_i -= 1;

    if(this.f_toLog.has('retry'))
      logRed('retryThis' + (desc ? '  desc: ' + WHITE(desc) : ''));

    if(this.onRetry) this.onRetry({
      type: 'retryThis',
      calledFrom: this.f_functionFlow[this.f_i],
      tries: this.f_tries,
      maxTries: this.f_maxTries
    });


    return this.f_next();
  },

  /** Retries task list from given method
   * Will carry on with functionFlow from the given method
   * Will increment maxTries.methodName
   * If methodIndex = 0, will increment tries.all
   * If the method given is not in functionFlow, log about it and add
   * an error.
   * NO auto data reset is done with this method! (can be done by user)
   *
   * @public
   * @arg method {string}       Method to retry functionFlow from
   * @arg desc   {string} opt.  Error description
   * @arg err    {Error}  opt.  Node error
   */
  retryFrom: function retryFrom(method, desc, err){

    if(desc || err) this.f_addErr(desc, err);

    var methodIndex = this.f_functionFlow.indexOf(method);

    // If the method is not found, log/err it and don't change f_i
    if(methodIndex === -1){
      var descStr = 'could not find method `' + method + '`.';
      this.f_addErr('retryFrom ' + descStr, 'this.methodIndex === -1');

      if(this.f_toLog.has('retry')) logRed('retryFrom  '  
        + (desc ? '' + RED('desc: ')  + WHITE(desc) + '\n     ': '')
        + WHITE(descStr + ' Will carry on normaly.')
      );

    }
    // Set f_i to methodIndex, so `next` will carry on from there
    else{
      if(this.f_toLog.has('retry')) logRed('retryFrom'
        + (desc ? '  desc: ' + WHITE(desc) : '')
        + RED('  retry from: ') + WHITE(method)
      );

      this.f_i = methodIndex;
    }

    if(this.onRetry) this.onRetry({
      type: 'retryFrom',
      calledFrom: this.f_functionFlow[this.f_i],
      tries: this.f_tries,
      maxTries: this.f_maxTries,
      method: method,
    });

    // Always use next, will carry on from given method if it's found
    // OR it will just act like nothing happened
    return this.f_next();
  },

  /** Retries a specific method
   * Has to use f_next logic!
   * @arg method {string}    Method to retry
   * @arg cb     {function}  Function to call when retry is done
   * @arg desc   {string}    opt.  Error description
   * @arg err    {Error}     opt.  Node error
   */
  retryMethod: function retryMethod(method, cb, desc, err){

    if(desc || err) this.f_addErr(desc, err);

    if(this.f_toLog.has('retry')) logRed('retryMethod: ' + WHITE(method)
      + (desc ? RED('  desc: ') + WHITE(desc) : '')
    );

    if(this.onRetry) this.onRetry({
      type: 'retryMethod',
      calledFrom: this.f_functionFlow[this.f_i -1],
      tries: this.f_tries,
      maxTries: this.f_maxTries,
      method: method,
    });

    // Is the method actualy present?
    if(this[method] && typeof this[method] === 'function'){

      // Make f_(next) know we called retryMethod
      this.f_retryMethodCall = true;

      // Save the old f_i value
      this.old_f_i = this.f_i;

      // Set f_i to the index of method in f_functionFlow
      this.f_i = this.f_functionFlow.indexOf(method);

      // Set the cb to call from f_next
      this.f_retryMethodCb = cb;

      // f_next call will result in going to the new f_i index method
      return this.f_next();
    }

    // If the method is not present
    else {
      // Add an error
      this.f_addErr('@retryMethod  Could not find method: ' + method,
        new Error('this[method] && typeof this[method] === \'function\''));

      // And then just normaly call f_next;
      return this.f_next();
    }

  },

  /** f_abort function
   * Calls f_logErrStack if wanted
   *
   * @public @private
   * @arg desc {string} opt.  Error description
   * @arg err  {Error} opt.   Node error
   */
  abort: function abort(desc, err){
    this.f_endTime = Date.now();
    this.f_timeTaken = this.f_endTime - this.f_startTime;

    this.f_addErr('ABORT  ' + (desc || ''), (err  || {}));

    if(this.f_toLog.has('abort')){
      logRed('Abort  ' + (desc ? 'desc: ' + WHITE(desc) : ''));
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
  toAugment = toAugment || undefined;;

  // Throw is used since we cannot do anything with f_ if reqs aren't met!
  // So when augmenting and setting up, we will do that in a try catch
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
    maxTries: config.maxTries || { wholeList : 10 },

    resetOnRetryAll: config.resetOnRetryAll || false
  };


  // Maybe maxTries is specified, but all property is not there.
  // This makes sure it's always there. No matter what.
  if(!props.maxTries.wholeList && props.maxTries.wholeList !== '?')
    props.maxTries.wholeList = 10;


  props.functionFlow.forEach(function (methodName){
    if(!props.maxTries[methodName] && props.maxTries[methodName] !== '?')
      props.maxTries[methodName] = 10;
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

  instance.f_tries = { wholeList: 0 };

  for(var method in instance.f_maxTries)
    instance.f_tries[method] = 0;

  return instance;
}

module.exports = { augment: augment, setup: setup };