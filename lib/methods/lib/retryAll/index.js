/**
 * @TODO everything
 * @param {string} message - Message to put in error getting created
 */
module.exports = function (message) {
  var err_object = this.f_addErr(message);
  this.f_flow_i = 0;
  // @TODO which data ?
  this.emit('retryAll', err_object);
  this.f_next();
};