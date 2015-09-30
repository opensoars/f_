/**
 * Sets f_ functionality to an instance object.
 * @module set/instance
 */

/**
 * Binds f_ instance functionality to the 1st argument. The 2nd options
 * argument allows configuration of the f_ functionality. Exported function.
 * @TODO decide whether all the logic in this function will be split up in
 * multiple functions or not.
 * @TODO Bind function_flow to instance scope
 * @public
 * @param {object} instance - Instance to set f_ instance data to
 * @param {object} [o] - `f_.set.instance user` options
 * @return {object} instance - Modified instance, with f_ instance data
 */
function setInstance(instance, o) {
  // @todo check params

  // Bind all configurable data
  instance[o ? (o.data_namespace || 'data') : 'data'] = {};

  // Bind all not configurable data
  instance.f_flow_i = 0;
  instance.f_errs = [];
  instance.f_logs = [];
  instance.f_history = [];

  //console.log('setInstance to this instance:', instance.__proto__);

  return instance;
}

module.exports = setInstance;