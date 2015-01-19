/**
 * DEPENDENCIES
 * ./methods.js  Collection of all f_ methods
 */


/**
 * All log triggers
 * These are added to f_to_log when ['all'] is specified
 *
 * @private
 */
var LOGTRIGGERS = [
  'start',
  'next',
  'retry',
  'error',
  'abort',
  'errStack',
  'finish'
];


// Require all f_ methods like: next, retryThis, etc
var METHODS = require('./methods.js');


/**
 * f_.augment
 * Use this function to add properties/methods to the prototype object.
 * We want these to be shared between instances, saves some overhead.
 * Will also work on objects. When we want a task list to run many times,
 * the constructor based approach is recommended
 *
 * @public
 * @param    to_augment {func/instance}
 * @return   to_augment {func/instance}
 */
module.exports = function augment(to_augment, config){
  to_augment = to_augment || undefined;;

  var to_augment_type = typeof to_augment;

  // Throw is used since we cannot do anything with f_ if reqs aren't met!
  // This allows to `try` an augment
  if(!to_augment)
    throw '!to_augment constructor|Object given';

  if(to_augment_type !== 'function' && to_augment_type !== 'object')
    throw 'wrong to_augment type, !function && !object';

  if(!config)
    throw '!config  f_ needs config object';

  if(typeof config !== 'object')
    throw 'wrong config type, !object';

  if(!config.function_flow)
    throw '!config.function_flow, f_ needs to know which methods to call';

  if( (config.function_flow instanceof Array) !== true ) 
    throw 'wrong config.function_flow type, !array';

  // Won't be looped, we need defaults!
  var props = {
    // NO DEFAULT, throw ^ if not present
    function_flow: config.function_flow, 

    // Below, all properties have default values
    err_array: config.err_array || 'errs',
    data_namespace: config.data_namespace || 'd',
    desc: config.desc || '',
    to_log: config.to_log || [],
    max_tries: config.max_tries || { wholeList : 10 },
    reset_on_retryAll: config.reset_on_retryAll || false
  };


  // Maybe max_tries is specified, but the all property is not there.
  // This makes sure it's always there. No matter what.
  if(!props.max_tries.wholeList && props.max_tries.wholeList !== '?')
    props.max_tries.wholeList = 10;


  // If there is an max_tries.allMethods, assign the value to all methods
  // ELSE, set max_tries to either given value or default
  if(props.max_tries.allMethods || props.max_tries.allMethods === 0){
    props.function_flow.forEach(function (methodName){
      // Set all max_tries[methodName] to max_tries.allMethods
      props.max_tries[methodName] = props.max_tries.allMethods;
    });
  }
  else{
    props.function_flow.forEach(function (methodName){
      // If there isn't a max_tries for a method, set it to default: 10
      if(!props.max_tries[methodName] && props.max_tries[methodName] !== '?')
        props.max_tries[methodName] = 10;
    });
  }


  // Will hold our f_ methods and properties, so we can later assign it
  // to either the prototype of to_augment or the plain to_augment object
  var f_holder;

  // IF we're dealing with a function / constructor
  // Make a copy of to_augment.prototype, store new properties in there.
  // Later we asign it back to to_augment its real prototype object
  // ELSE we're dealing with a plain object, we simply store all new properties
  // in the f_holder object and later we assign it back to to_augment
  if(to_augment_type === 'function') f_holder = to_augment.prototype;
  else f_holder = to_augment;

  // Add methods to f_holder
  for(var methodName in METHODS)
    f_holder['f_' + methodName] = METHODS[methodName];
  
  // Add properties f_holder
  for(var propName in props)
    f_holder['f_' + propName] = props[propName];


  /**
   * Helper functions which shortens f_to_log indexOf logic
   *
   * @private
   * @param  checkFor {string}
   * @return          {bool}    whether it contains checkFor or not
   */
  f_holder.f_to_log.has = function (checkFor){
    return f_holder.f_to_log.indexOf(checkFor) === -1 ? false : true;
  };

  // Add all triggers from LOGTRIGGERS if to_log === ['all']
  if(f_holder.f_to_log.has('all')){
    f_holder.f_to_log.splice(0, 1);
    LOGTRIGGERS.forEach(function (trigger){ f_holder.f_to_log.push(trigger); });
  };

  // If we're dealing with functions/classes, assign f_ logic to the prototype
  if(to_augment_type === 'function') to_augment.prototype = f_holder;
  // ELSE we're dealing with a plain object, we assign f_ logic to the object
  else to_augment = f_holder;


  // Return our completely augmented function/constructor OR object
  return to_augment;
}