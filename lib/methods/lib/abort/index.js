/**
 * @TODO desc
 * @param {string} message - Message to put in error
 */
module.exports = function (message) {
  var err_object = this.f_addErr(message);
  // @TODO which data to pass, desc
  this.emit('abort');
  // @TODO log event
};