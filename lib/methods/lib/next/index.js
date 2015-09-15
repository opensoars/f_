/**
 * f_.next method module.
 * @module f_.next
 * @example
 * // Results in the calling of the next method in the `function_flow`
 * this.f_.next('arg0', 'arg1');
 */
module.exports = function () {
  /**
   * Needed cuz `this.function_flow_i` should be bumped before the
   * corresponding function_flow method is called.
   */
  var old_function_flow_i = this.function_flow_i

  if (this.instance) {
    this.function_flow_i++;

    if (this.function_flow[old_function_flow_i] &&
        typeof this.instance[this.function_flow[old_function_flow_i]] ===
        'function') {
      this.instance[this.function_flow[old_function_flow_i]].apply(
        this.instance, arguments.length ? arguments : undefined
      );
    }
    else {
      console.log('Ended function_flow');
    }
  }
  else if (this.constructor) {

  }
  else {

  }
};