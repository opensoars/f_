/**
 * @module
 *
 * @param {object} instance - Instance to set f_ instance data to
 * @param {object} options - `f_.set.instance user` options
 * @return {object} instance - Modified instance, with f_ instance data
 */
function instance(instance, options) {

  /** @todo check params */

  // Bind all configurable data
  //instance.f_[
  //  instance.data_namespace ||
  //  options.data_namespace ||
  //  'data_namespace'
  //] = {};

  // Bind all not configurable data
  instance.f_.function_flow_i = 0;
  instance.f_.errs = [];

  // Seems kinda needed?!?! for `next.call(this_arg)`
  instance.f_.instance = instance;

  return instance;
}


module.exports = instance;