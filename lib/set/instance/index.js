/**
 * @module
 *
 * @param {object} instance - Instance to set f_ instance data to
 * @param {object} options - `f_.set.instance user` options
 * @return {object} instance - Modified instance, with f_ instance data
 */
function instance(instance, options) {

  /** @todo check params */

  instance.f_[
    instance.data_namespace ||
    options.data_namespace ||
    'data_namespace'
  ] = {};

  //instance.f_

  instance.f_.errs = [];

  return instance;
}


module.exports = instance;