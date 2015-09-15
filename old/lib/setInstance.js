/**
 * DEPENDENCIES
 * NONE
 */


/**
 * F_.setInstance
 * Use this function to add properties/methods we do not want to be
 * added to the prototype object but instead to a single instance.
 * Not used to set user data. Just further f_ setInstance.
 * This will work normaly when we're working with an object instead
 * of a function/constructor
 *
 * @param  instance {func/inst}
 * @return instance {func/inst}  Configurated instance
 */
module.exports = function setInstance(instance){

  // Throw, since we don't want unexpected behaviour
  if(!instance) throw 'no instance given';
  if(typeof instance !== 'object') throw "typeof instance !== 'object'";

  // Used to not overwrite startTime on retries
  instance.f_has_initialized = false;

  // Set error array to given property key
  instance['f_' + instance.f_err_array] = [];

  // Set data namespace to given property key
  instance[instance.f_data_namespace] = {};

  // f_ iterator will be set to 0 (first function in function_flow array)
  instance.f_i = 0;

  // unresolved, finished or aborted
  instance.f_status = 'unresolved';

  // f_tries holds whole_list and method tries
  instance.f_tries = { whole_list: 0 };

  // Set f_tries.methodName to 0 for each method
  for(var method in instance.f_max_tries)
    instance.f_tries[method] = 0;

  return instance;
}