/**
 * `f_abort` method module.
 * @module methods/abort
 * @param {any} message
 * @return {object} this
 * @example
 * this.f_abort('Error');
 */
module.exports = function f_abort(message) {
  var err_object = this.f_err('abort, ' + message);

  /**
   * @TODO which data to pass, desc
   * @event abort
   */
  this.emit('abort', err_object);

  return this;
};