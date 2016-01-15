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

  var next_flow,
      next_flow_index;

  this.f_function_flow.forEach(function (flow, i) {
    if (flow.name === method) {
      next_flow = flow;
      next_flow_index = i;
    }
  });

  if (next_flow && typeof this[next_flow.name] === 'function') {

    if (next_flow.tries >= next_flow.max_tries) {
      this.f_abort(next_flow.name + '.tries >= ' + next_flow.name +
        '.max_tries');
    }
    else {
      /**
       * retryFrom event. Emits an err_object
       * @event retryFrom
       */
      this.emit('retryFrom', err_object);

      this.f_flow_i = next_flow_index;
      this.f_next();
    }
  }
  else {
    this.f_abort('No function to call from retryFrom');
  }

  return this;
};