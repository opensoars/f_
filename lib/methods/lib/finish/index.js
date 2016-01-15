/**
 * @module methods/finish
 * @return {object} this
 * @example
 * // Emits the finish event
 * this.f_finish();
 */
module.exports = function f_finish() {

  /**
   * Set completion date in Epoch.
   * @type {number}
   */
  this.f_completed_at = new Date().getTime();

  /**
   * Finish event.
   * @event finish
   */
  this.emit('finish');

  return this;
};
