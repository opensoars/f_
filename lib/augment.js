/**
 * DEPENDENCIES
 * ./methods.js  Collection of all f_ methods
 */


/**
 * All log triggers
 * These are added to f_toLog when ['all'] is specified
 *
 * @private
 */
var LOGTRIGGERS = ['start', 'next', 'retry', 'error', 'abort', 'errStack', 'finish'];


// Require all f_ methods like: next, retryThis, etc
var METHODS = require('./methods.js');


/**
 * f_.augment
 * Use this function to add properties/methods to the prototype object.
 * We want these to be shared between instances, saves some overhead.
 * Will also work on objects. When we want a task list to run many times,
 * the class based approach is recommended
 *
 * @public
 * @param    toAugment {func/instance}
 * @return   toAugment {func/instance}
 */
module.exports = function augment(toAugment, config){
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

  if( (config.functionFlow instanceof Array) !== true ) 
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


  // If there is an maxTries.allMethods, assign the value to all methods
  // ELSE, set maxTries to either given value or default
  if(props.maxTries.allMethods || props.maxTries.allMethods === 0){
    props.functionFlow.forEach(function (methodName){
      // Set all maxTries[methodName] to maxTries.allMethods
      props.maxTries[methodName] = props.maxTries.allMethods;
    });
  }
  else{
    props.functionFlow.forEach(function (methodName){
      // If there isn't a maxTries for a method, set it to default: 10
      if(!props.maxTries[methodName] && props.maxTries[methodName] !== '?')
        props.maxTries[methodName] = 10;
    });
  }




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
   * @param  checkFor {string}
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