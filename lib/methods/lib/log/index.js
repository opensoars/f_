/**
 * f_ log method.
 * @TODO desc
 * @module methods/log
 * @param {string} message - Message to log
 */
module.exports = function f_log(message) {
  var log_obj = {
    time: new Date().getTime(),
    message: message,
    called_from: this.f_function_flow[this.f_flow_i-1].name
  };

  this.f_logs.push(log_obj);

  /**
   * Log event.
   * @event log
   * @type object
   * @property {number} time
   * @property {string} message - Message passed to f_log
   * @proptery {string} called_from - Which function f_log was called from
   */
  this.emit('log', log_obj);
};