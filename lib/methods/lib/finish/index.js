/**
 * @module methods/finish
 * @return {object} this
 */
module.exports = function f_finish() {

  /**
   * Set completion date in Epoch.
   * @type {number}
   */
  this.f_completed_at = new Date().getTime();

  /**
   * @TODO which data to pass, desc
   * Finish event.
   * @event finish
   */
  this.emit('finish');

  return this;
};
