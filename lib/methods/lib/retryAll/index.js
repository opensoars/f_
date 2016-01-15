/**
 * retryAll method module. Resets f_flow_i to 0 and calls f_next.
 * @module methods/retryAll
 * @param {any} message
 * @return {object} this
 * @example
 * this.f_retryAll('Error');
 */
module.exports = function f_retryAll(message) {
  var err_object = this.f_err('retryAll, ' + message);

  /**
   * retryAll event. Emits an err_object.
   * @event retryAll
   */
  this.emit('retryAll', err_object);

  this.f_flow_i = 0;
  this.f_next();

  return this;
};