/**
 * @module instance_modules/log
 */

/**
 * @param {string} message - Message to include in log_object
 * @return {object} log_object
 */
var log = function (message) {
  var log_object = {
    time: new Date().getTime(),
    message: message
  };

  this.f_log.data.push(log_object);
  this.f_history(log_object);

  /**
   * Log event. Passes log_object.
   * @event log
   * @type {object}
   */
  this.emit('log', log_object);

  return log_object;
};

/** */
log.data = [];


module.exports = log;