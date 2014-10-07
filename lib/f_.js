/** All log triggers
 * These are added to f_toLog when ['all'] is specified
 *
 * @private
 */
var LOGTRIGGERS = ['start', 'next', 'retry', 'error', 'abort', 'errStack', 'finish'];

// Require all f_ methods like: next, retryThis, etc
var METHODS = require('./methods.js');


/** f_.augment
 * Use this function to add properties/methods to the prototype object.
 * We want these to be shared between instances, saves some overhead.
 * Will also work on objects. When we want a task list to run many times,
 * the class based approach is recommended
 *
 * @public
 * @arg    toAugment {func/instance}
 * @return toAugment {func/instance}
 */
function augment(toAugment, config){
  toAugment = toAugment || undefined;;

  var toAugmentType = typeof toAugment;

  // Throw is used since we cannot do anything with f_ if reqs aren't met!
  if(!toAugment)
    throw '!toAugment Class|Object given';

  if(toAugmentType !== 'function' && toAugmentType !== 'object')
    throw 'wrong toAugment type, !function && !object';

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
    // NO DEFAULT, throw ^ if not present
    functionFlow: config.functionFlow, 

    // Below, all properties have default values
    errorArray: config.errorArray || 'errs',
    dataNamespace: config.dataNamespace || 'd',
    desc: config.desc || '',
    toLog: config.toLog || [],
    maxTries: config.maxTries || { wholeList : 10 },
    resetOnRetryAll: config.resetOnRetryAll || false
  };


  // Maybe maxTries is specified, but all property is not there.
  // This makes sure it's always there. No matter what.
  if(!props.maxTries.wholeList && props.maxTries.wholeList !== '?')
    props.maxTries.wholeList = 10;

  // If there isn't a maxTries for a method, set it to default: 10
  props.functionFlow.forEach(function (methodName){
    if(!props.maxTries[methodName] && props.maxTries[methodName] !== '?')
      props.maxTries[methodName] = 10;
  });


  // Will hold our f_ methods and properties, so we can later assign it
  // to either the prototype of toAugment or the plain toAugment object
  var f_holder;

  // IF we're dealing with a function / class
  // Make a copy of toAugment.prototype, store new properties in there.
  // Later we asign it back to toAugment its real prototype object
  // ELSE we're dealing with a plain object, we simply store all new properties
  // in the f_holder object and later we assign it back to toAugment
  if(toAugmentType === 'function') f_holder = toAugment.prototype;
  else f_holder = toAugment;

  // Add methods to f_holder
  for(var methodName in METHODS)
    f_holder['f_' + methodName] = METHODS[methodName];
  
  // Add properties f_holder
  for(var propName in props)
    f_holder['f_' + propName] = props[propName];


  /**
   * Helper functions which shortens f_toLog indexOf logic
   *
   * @private
   * @arg    checkFor {string}
   * @return          {bool}    whether it contains checkFor or not
   */
  f_holder.f_toLog.has = function (checkFor){
    return f_holder.f_toLog.indexOf(checkFor) === -1 ? false : true;
  };

  // Add all triggers from LOGTRIGGERS if toLog === ['all']
  if(f_holder.f_toLog.has('all')){
    f_holder.f_toLog.splice(0, 1);
    LOGTRIGGERS.forEach(function (trigger){ f_holder.f_toLog.push(trigger); });
  };

  // If we're dealing with functions/classes, assign f_ logic to the prototype
  if(toAugmentType === 'function') toAugment.prototype = f_holder;
  // ELSE we're dealing with a plain object, we assign f_ logic to the object
  else toAugment = f_holder;


  // Return our completely augmented function/class OR object
  return toAugment;
}


/** F_.setup
 * Use this function to add properties/methods we do not want to be
 * added to the prototype object but instead to a single instance.
 * Not used to set user data. Just further f_ setup.
 * This will work normaly when we're working with an object instead
 * of a function/class
 *
 * @public
 * @arg    instance {func/inst}  
 * @return instance {func/inst}  Configurated instance
 */
function setup(instance){

  // Throw, since we don't want unexpected behaviour
  if(!instance) throw 'no instance given';
  if(typeof instance !== 'object') throw "typeof instance !== 'object'";

  // Used to not overwrite startTime
  instance.f_hasInitialized = false;

  // Set error array to given property key
  instance['f_' + instance.f_errorArray] = [];

  // Set data namespace to given property key
  instance[instance.f_dataNamespace] = {};

  // f_ iterator will be set to 0 (first function in functionFlow)
  instance.f_i = 0;

  // unresolved, finished, aborted
  instance.f_status = 'unresolved';

  // f_tries holds wholeList and method tries
  instance.f_tries = { wholeList: 0 };

  // Set f_tries.methodName to 0 for each method
  for(var method in instance.f_maxTries)
    instance.f_tries[method] = 0;

  return instance;
}

module.exports = { augment: augment, setup: setup };