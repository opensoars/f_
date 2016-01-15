/**
 * retryMethod method module. Retries a method without interfering
 * with the function_flow iterator. Increments the method tries.
 * @param {string} method - Method to retry
 * @param {any} err
 * @return {object} this
 * @example
 * this.f_retryMethod('Error');
 */
module.exports = function f_retryMethod(method, err) {

  if (!method || typeof method !== 'string') {
    return this.f_abort('Expected a function name string as argument 1');
  }
  else if (!this[method] || typeof this[method] !== 'function') {
    return this.f_abort('No function to call was found');
  }

  var err_object = this.f_err('retryMethod, ' + err);

  /**
   * @event retryMethod
   */
  this.emit('retryMethod', err_object);

  return this;
};