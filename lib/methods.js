/** 
 * DEPENDENCIES
 * ezlog, cls  For colorized logging
 */



/** 
 * f_ methods dependencies
 * Only colorized logging related
 */
var Ezlog = require(__dirname + './../node_modules/ezlog'),
    cls = require(__dirname + './../node_modules/opensoars_cls'),
    log = new Ezlog({p:{t:'[f_]',c:'yellow'}}),
    logGreen = new Ezlog({ p:{t:'[f_]',   c:'yellow'}, t: {c:'green'} }),
    logRed = new Ezlog({   p:{t:'[f_]', c:'yellow'}, t: {c:'red'} });


/**
 * Global color helper functions to make cls calls in code unnecessary
 *
 * @param  t {string}  Text to color
 * @return   {string}  Colorized text
 */
function GREEN(t){ return cls(t, 'green');        }
function RED(t){   return cls(t, 'red'  );        }
function WHITE(t){ return cls(t, 'white');        }
function BLUE(t){  return cls(t, 'blue', 'bold'); }


/**
 * All f_ methods, contain all f_ method logic
 * Will be added to prototype object of toAugment (constructor) or to a plain
 * object by looping through the methods. Methods bill be prefixed w/ `f_`
 */
module.exports = {

  /**
   * Used internally and from within task lists.
   * Simple description of how next works:
   * - Starting task?
   * - Finishing task?
   * - Is there a method to call?
   * - Are we exceeding maxTries?
   * - Are we handling a retryMethod cb?
   * - Call onNext if wanted
   * - Call method
   *
   * @public
   */
  next: function (){
    // Are we starting a task list?
    if(this.f_i === 0 && this.f_has_initialized === false){
      this.f_start_time = Date.now(); 
      this.f_has_initialized = true;
    }

    if(this.f_i === 0) this.f_tries.whole_list += 1;

    // Are we exceeding maxTries.whole_list?
    // If yes, abort. If not, continue
    if(this.f_tries.whole_list > this.f_max_tries.whole_list &&
       this.f_tries.whole_list !== '?')
        return this.f_abort('Max all tries exceeded',
          new Error('this.f_tries.whole_list > this.f_max_tries.whole_list'));


    if(this.f_i === 0 && !this.f_retryMethodCall && this.f_to_log.has('start'))
      log('Starting task '
        + (this.f_desc ? BLUE(' ' + this.f_desc) : '')
        + '  Attempt ' + GREEN(this.f_tries.whole_list)
        + (this.f_max_tries.whole_list !== '?'
          ? '/' + RED(this.f_max_tries.whole_list) : '')
      );

    // Are we done with tasks from function_flow? If yes finish
    if(this.f_i === this.f_function_flow.length)
      return this.f_finish();


    // Get method from function_flow array
    var method = this.f_function_flow[this.f_i];

    // Is the method actualy there? And is it a function ?
    if(this[method] && typeof this[method] === 'function'){

      this.f_tries[method] += 1

      // If a f_maxTries is set for a certain method and it exceeds
      // f_tries, abort
      if(this.f_max_tries[method] && this.f_max_tries[method] !== '?'){
        if(this.f_tries[method] > this.f_max_tries[method] &&
           this.f_max_tries[method] !== '?')
          return this.f_abort('`' + method + '` maxTries exceeded',
            'this.f_tries[method] > this.f_max_tries[method]');
      }


      // Logs method name. If maxTries is set for a method, log about tries
      if(this.f_to_log.has('next')) log('next: ' + BLUE(method)
        + '\tAttempt ' + GREEN(this.f_tries[method])
        + (this.f_max_tries[method] !== '?'
            ?  '/' + RED( this.f_max_tries[method]) : '')
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
    // If we can't call another function from function_flow, ABORT!
    else return this.f_abort('no next function in function_flow');
  },

  /**
   * Simple namespace reset function
   * Sets data namespace to an empty object
   *
   * @public
   */
  resetNamespace: function (){
    this[this.f_data_namespace] = {};
  },

  /**
   * Helper function to add errors to f_errs array
   *
   * @param desc {string}  Error description
   * @param err  {Error}   Node error
   */
  addErr: function (desc, err){
    this.f_errs.push({ desc: (desc || ''), err: (err || {}) });
  },

  /**
   * Error stack logger helper function
   * Pretty prints the error stack
   * Gets called from f_abort (if wanted)
   */
  logErrStack: function (){
    logRed('- f_errs -');
    this.f_errs.forEach(function (err){ console.log(err); });
    logRed('- f_errs -');
  },

  /**
   * Retries all methods
   * Resets data if wanted
   * Resets f_i, starting with function_flow[0]
   * Calls onRetry if wanted
   * 
   * @public
   * @param desc {string} opt.  Error description
   * @param err  {Error}  opt.  Node error
   */
  retryAll: function (desc, err){

    if(desc || err) this.f_addErr(desc, err);

    if(this.f_to_log.has('retry'))
      logRed('retryAll' + (desc ? '  desc: ' + WHITE(desc) : ''))

    // Do we want a data namespace reset ?
    if(this.f_reset_on_retryAll) this.f_resetNamespace();


    if(this.onRetry) this.onRetry({
      type: 'retryAll',
      calledFrom: this.f_function_flow[this.f_i - 1],
      tries: this.f_tries,
      maxTries: this.f_max_tries
    });

    // Reset f_i so we can retry whole function_flow
    this.f_i = 0;

    return this.f_next();
  },

  /**
   * Retries method where this method is called from
   * Carries on with function_flow as if nothing happened
   * Increments maxTries.methodName
   * Calls onRetry if wanted
   * NO auto data reset is done with this method! (can be done by user)
   *
   * @public
   * @param desc {string} opt.  Error description
   * @param err  {Error}  opt.  Node error
   */
  retryThis: function (desc, err){

    if(desc || err) this.f_addErr(desc, err);

    // Use this becuase f_ will make use of 'next' logic (maxTries)
    this.f_i -= 1;

    if(this.f_to_log.has('retry'))
      logRed('retryThis' + (desc ? '  desc: ' + WHITE(desc) : ''));

    if(this.onRetry) this.onRetry({
      type: 'retryThis',
      calledFrom: this.f_function_flow[this.f_i],
      tries: this.f_tries,
      maxTries: this.f_max_tries
    });


    return this.f_next();
  },

  /**
   * Retries task list from given method
   * Will increment maxTries.methodName
   * If methodIndex = 0, will increment tries.all
   * If the method given is not in function_flow, log about it and add
   * an error.
   * Calls onRetry if wanted
   * NO auto data reset is done with this method! (can be done by user)
   *
   * @public
   * @param method {string}       Method to retry function_flow from
   * @param desc   {string} opt.  Error description
   * @param err    {Error}  opt.  Node error
   */
  retryFrom: function (method, desc, err){

    if(desc || err) this.f_addErr(desc, err);

    var methodIndex = this.f_function_flow.indexOf(method);

    // If the method is not found, log/err it and don't change f_i
    if(methodIndex === -1){
      var descStr = 'could not find method `' + method + '`.';
      this.f_addErr('retryFrom ' + descStr, 'this.methodIndex === -1');

      if(this.f_to_log.has('retry')) logRed('retryFrom  '  
        + (desc ? '' + RED('desc: ')  + WHITE(desc) + '\n     ': '')
        + WHITE(descStr + ' Will carry on normaly.')
      );

    }
    // Set f_i to methodIndex, so `next` will carry on from there
    else{
      if(this.f_to_log.has('retry')) logRed('retryFrom'
        + (desc ? '  desc: ' + WHITE(desc) : '')
        + RED('  retry from: ') + WHITE(method)
      );

      this.f_i = methodIndex;
    }

    if(this.onRetry) this.onRetry({
      type: 'retryFrom',
      calledFrom: this.f_function_flow[this.f_i],
      tries: this.f_tries,
      maxTries: this.f_max_tries,
      method: method,
    });

    // 'next' will carry on from given method if it's found
    // OR it will just act like nothing happened
    return this.f_next();
  },

  /**
   * Retries a specified method
   * Has to use f_next logic!
   * Calls onRetry if wanted
   *
   * @public
   * @param method {string}    Method to retry
   * @param cb     {function}  Function to call when retry is done
   * @param desc   {string}    opt.  Error description
   * @param err    {Error}     opt.  Node error
   */
  retryMethod: function (method, cb, desc, err){

    if(desc || err) this.f_addErr(desc, err);

    if(this.f_to_log.has('retry')) logRed('retryMethod: ' + WHITE(method)
      + (desc ? RED('  desc: ') + WHITE(desc) : '')
    );

    if(this.onRetry) this.onRetry({
      type: 'retryMethod',
      calledFrom: this.f_function_flow[this.f_i -1],
      tries: this.f_tries,
      maxTries: this.f_max_tries,
      method: method,
    });

    // Is the method actualy present?
    if(this[method] && typeof this[method] === 'function'){

      // Makes f_(next) know we called retryMethod
      this.f_retryMethodCall = true;

      // Save the old f_i value
      this.old_f_i = this.f_i;

      // Set f_i to the index of method in f_function_flow
      this.f_i = this.f_function_flow.indexOf(method);

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

  /**
   * f_abort function
   * Calls f_logErrStack if wanted
   * Calls onAbort if it's set
   *
   * @public
   * @param desc {string} opt.  Error description
   * @param err  {Error} opt.   Node error
   */
  abort: function (desc, err){
    this.f_end_time = Date.now();
    this.f_time_taken = this.f_end_time - this.f_start_time;

    this.f_addErr('ABORT  ' + (desc || ''), (err  || {}));

    if(this.f_to_log.has('abort')){
      logRed('Abort  ' + (desc ? 'desc: ' + WHITE(desc) : ''));
      logRed("Time taken: " + this.f_time_taken.toString() + " ms");
    }

    if(this.f_to_log.has('errStack')) this.f_logErrStack();

    this.f_status = 'aborted';

    if(this.onAbort) return this.onAbort();
  },

  /**
   * When we are done with f_ task this method gets called
   * Calculates the time taken to complete the task
   * Logs about results if wanted
   * Calls onFinish if it's set
   *
   * @public
   */
  finish: function (){
    this.f_end_time = Date.now();
    this.f_time_taken = this.f_end_time - this.f_start_time;

    if(this.f_to_log.has('finish'))
      log(GREEN('finished')
        + (this.f_desc ? " '" + this.f_desc + "'" : '')
        + ' time taken: '
        + GREEN(this.f_time_taken.toString()) + ' ms');

    this.f_status = 'finished'

    if(this.onFinish) return this.onFinish();
  },

  /**
   * Cleans up used memory
   * It will NOT be called when f_ finishes
   * This call will be put into a timeout
   *
   * It cleans up this.__proto__
   * It cleans up this.propertyName
   *
   * @public
   * @return null  The wanted instance value so the GC can clean
   */
  cleanup: function (){
    this.__proto__ = null;
    for(var prop in this) delete this[prop];

    return null;
  }

};