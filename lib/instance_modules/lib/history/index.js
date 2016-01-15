/**
 * Gets called when f_log or f_err gets called. Puts the passed
 * history (object) in its data array. This is a collection of both
 * err_object and log_object.
 * @module instance_modules/history
 */

/**
 * @param {object} history_object - Either a log_object or an err object
 * @return {object} history_object
 */
var history = function (history_object) {
  this.f_history.data.push(history_object);

  /**
   * History event. Emits history_object.
   * @event history
   * @type {object}
   */
  this.emit('history', history_object);

  return history_object;
};

/** */
history.data = [];

module.exports = history;