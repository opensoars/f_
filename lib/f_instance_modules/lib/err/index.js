/**
 * @module instance_modules/err
 */

/**
 * @param {string} message
 */
var err = function (message) {
  var err_object = new Error(message);
  err_object.time = new Date().getTime();

  this.f_err.data.push(err_object);
  this.f_history(err_object);

  this.emit('f_log', err_object);
};

/** */
err.data = [];

module.exports = err;