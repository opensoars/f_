/**
 * @module instance_modules/history
 */

/**
 * @param {string} history_object
 */
var history = function (history_object) {
  this.f_history.data.push(history_object);
  this.emit('f_history', history_object);
};

/** */
history.data = [];

module.exports = history;