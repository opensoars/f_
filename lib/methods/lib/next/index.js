/**
 * f_.next method module.
 * @TODO desc
 * @module methods/next
 * @example
 * // Results in the calling of the next method in the `function_flow`
 * this.f_.next('arg0', 'arg1');
 */
module.exports = function next() {
  /**
   * Needed cuz `this.function_flow_i` should be bumped before the
   * corresponding function_flow method is called.
   */
  var old_function_flow_i = this.function_flow_i,
      next_in_flow,
      next_method_name,
      next_method;

  // @TODO handle reqs
  if (!this.function_flow) {}

  if (this.instance) {
    if (this.function_flow[old_function_flow_i]) {
      next_in_flow = this.function_flow[old_function_flow_i];
      next_method_name = next_in_flow.name;
      next_method = this.instance[next_method_name];
    }
    else {
      // Will I be handling function_flow finishes here as well?
    }
  }
  else if (this.constructor) {
    // What would happen with the meaning of this whilst calling a
    // prototype method?
  }
  else {
    // What happens when theres neither a constructor nor an instance?!
  }

  // Check if all data is present in order to call the next method and bump
  // function_flow_i
  if (next_in_flow && next_method_name && typeof next_method === 'function') {
    this.function_flow_i++;
    next_method.apply(this.instance, arguments.length ? arguments : undefined)
  }

};