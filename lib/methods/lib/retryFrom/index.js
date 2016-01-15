/**
 * retryFrom method module. Retries the f_task list from the given
 * method
 * @module methods/retryAll
 * @param {string} method - Retry f_ task list from this method
 * @param {any} error
 * @return {object} this
 * @example
 * this.retryMethod('method2', 'Error');
 */
module.exports = function retryFrom(method, error) {
  var err_object = this.f_err('retryAll, ' + error);

  ///this.f_flow_i = 0;

  ///this.f_next();

  var next_flow,
      next_flow_index;

  this.f_function_flow.forEach(function (flow, i) {
    if (flow.name === method) {
      next_flow = flow;
      next_flow_index = i;
    }
  });

  if (next_flow && typeof this[next_flow.name] === 'function') {

    /**
     * @event retryFrom
     */
    this.emit('retryFrom', err_object);

    this.f_flow_i = next_flow_index;
    this[next_flow.name]();

  }
  else {
    this.f_abort('No function to call');
  }

  return this;
};