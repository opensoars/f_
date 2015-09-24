/**
 * Retries every whole function_flow from the start. Takes a message
 * as an error message from which an err_object gets created.
 * @TODO everything
 * @param {string} message - Message to put in error getting created
 */
module.exports = function f_retryAll(message) {
  /**
   * Error object which gets passed along with the emitted event.
   * @type object
   */
  var err_object = this.f_addErr(message);
  this.f_flow_i = 0;
  // @TODO which data ?
  /**
   * `retryAll` event. Passes on the created err_object.
   * @event retryAll
   * @type object
   */
  this.emit('retryAll', err_object);
  this.f_next();
};