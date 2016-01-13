/**
 * @TODO
 * @module methods/finish
 * @return {object} this
 */
module.exports = function f_finish() {

  /**
   * @TODO which data to pass, desc
   * Finish event.
   * @event finish
   */
  this.emit('finish');

  /**
   * Set completion date in Epoch.
   * @type {number}
   */
  this.f_completed_at = new Date().getTime();

  return this;
};
