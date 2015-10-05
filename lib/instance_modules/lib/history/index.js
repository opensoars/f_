/**
 * @module instance_modules/history
 */

/**
 * @param {object} history_object - Either a log_object or an err object
 * @return {object} history_object
 */
var history = function (history_object) {
  this.f_history.data.push(history_object);

  /**
   * History event. Passes history_object.
   * @event history
   * @type {object}
   */
  this.emit('history', history_object);

  return history_object;
};

/** */
history.data = [];

module.exports = history;