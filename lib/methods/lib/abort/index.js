/**
 * `f_abort` method module.
 * @module methods/abort
 * @TODO everything
 */
module.exports = function f_abort(message) {

  var err_object = this.f_err(message);

  /**
   * @TODO which data to pass, desc
   * @event abort
   */
  this.emit('abort', err_object);
};