/**
 * Pushes a error object to `this.f_errs` and `this.f_history`.
 * Emits `err` event.
 * @module methods/addErr
 * @param {string} message - Message to put in the err_object
 * @return {object} err_object - Error object stored in f_errs
 */
module.exports = function f_addErr(message) {
  var latest_flow = this.f_function_flow[this.f_flow_i] ?
    this.f_function_flow[this.f_flow_i] :
    this.f_function_flow[this.f_flow_i-1];

  /**
   * @TODO desc
   * @type object
   */
  var err_object = {
    time: new Date().getTime(),
    error: new Error(message),
    latest_flow: latest_flow ? latest_flow.name : '?'
  };

  this.f_errs.push(err_object);
  this.f_history.push(err_object);

  /**
   * Error event.
   * @event err
   * @type object
   * @property {number} time - new Date().getTime()
   * @property {object} error - Newly created error instance with passed msg
   * @proptery {string} latest_flow - Which function f_log was called from
   */
  this.emit('err', err_object);

  return err_object;
};