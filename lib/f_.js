




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

module.exports = {
  augment: require('./augment.js'),
  setup: setup
};