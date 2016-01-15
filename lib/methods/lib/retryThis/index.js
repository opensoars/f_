/**
 * retryThis method module. Retries the f_ task list from the
 * f_ task retryThis is called from.
 * @module methods/retryThis
 * @param {any} error
 * @return {object} this
 * @example
 * this.f_retryThis('Error');
 */
module.exports = function f_retryThis(error) {
  var err_object = this.f_err('retryThis, ' + error);
  this.f_flow_i-=1;
  this.f_next();

  /**
   * retryThis event. Emits an err_object
   * @event retryThis
   */
  this.emit('retryThis', err_object);

  return this;
};