/**
 * @TODO desc
 * @module methods/abort
 * @param {string} message - Message to put in error
 */
module.exports = function (message) {
  var err_object = this.f_addErr(message);
  // @TODO which data to pass, desc
  /**
   * Abort event.
   * @event abort
   * @type object
   */
  this.emit('abort', err_object);
};