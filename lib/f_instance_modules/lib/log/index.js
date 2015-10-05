/**
 * @module instance_modules/log
 */

/**
 * @param {string} message
 */
var log = function (message) {
  var log_object = {
    time: new Date().getTime(),
    message: message
  };

  this.f_log.data.push(log_object);
  this.f_history(log_object);

  this.emit('f_log', log_object);
};

/** */
log.data = [];


module.exports = log;