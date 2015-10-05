/**
 * `f_retryAll` method module.
 * @module methods/retryAll
 * @TODO everything
 */
module.exports = function f_retryAll(message) {

  this.f_err(message);

  /**
   * @TODO which data to pass, desc
   * @event retryAll
   */
  this.emit('retryAll');
};