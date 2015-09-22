/**
 * @TODO desc
 * @param {string} message - Message to put in error getting created
 */
module.exports = function (message) {

  this.f_addErr(message);

  this.f_flow_i = 0;

  // @TODO which data ?
  this.emit('retryAll');

  this.f_next();
};