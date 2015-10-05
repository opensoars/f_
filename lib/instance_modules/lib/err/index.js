/**
 * @module instance_modules/err
 */

/**
 * @param {string} message - Message to include in err_object
 * @return {object} err_object
 */
var err = function (message) {
  var err_object = new Error(message);
  err_object.time = new Date().getTime();

  this.f_err.data.push(err_object);
  this.f_history(err_object);

  /**
   * Error event. Passes err_object.
   * @event err
   * @type {object}
   */
  this.emit('err', err_object);

  return err_object;
};

/** */
err.data = [];

module.exports = err;