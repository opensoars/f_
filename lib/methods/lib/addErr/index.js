/**
 * @TODO desc
 * @module methods/addErr
 * @param {string} message - Message to put in the err_object
 */
module.exports = function f_addErr(message) {
  var err_object = {
    time: new Date().getTime(),
    error: new Error(message),
    called_from: this.f_function_flow[this.f_flow_i-1].name
  };

  this.f_errs.push(err_object);

  /**
   * Error event.
   * @event err
   * @type object
   * @property {number} time - new Date().getTime()
   * @property {object} error - Newly created error instance with passed msg
   * @proptery {string} called_from - Which function f_log was called from
   */
  this.emit('err', err_object);
};