/**
 * Abort f_. Takes a message as an error message from which an err_object
 * gets created.
 * @TODO desc
 * @module methods/abort
 * @param {string} message - Message to put in error
 */
module.exports = function f_abort(message) {
  /**
   * Error object which gets passed along with the emitted event.
   * @type object
   */
  var err_object = this.f_addErr(message);
  // @TODO which data to pass, desc
  /**
   * Abort `abort` event. Passes on the created err_object.
   * @event abort
   * @type object
   */
  this.emit('abort', err_object);
};