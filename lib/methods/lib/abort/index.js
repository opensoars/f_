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
   * Set abortion date in Epoch.
   * @type {number}
   */
  this.f_aborted_at = new Date().getTime();

  /**
   * abort event. Emits an err_object.
   * @event abort
   */
  this.emit('abort', err_object);

  return this;
};