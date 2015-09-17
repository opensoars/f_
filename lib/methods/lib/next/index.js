/**
 * f_.next method module.
 * @TODO desc
 * @module methods/next
 * @example
 * // Results in the calling of the next method in the `f_function_flow`
 * this.f_next('arg0', 'arg1');
 */
module.exports = function next() {
  /**
   * Needed cuz `this.f_flow_i` should be bumped before the
   * corresponding f_function_flow method is called.
   */
  var old_function_flow_i = this.f_flow_i,
      next_in_flow,
      next_method_name,
      next_method;

  // @TODO handle reqs
  if (!this.f_function_flow) {}

  if (this.f_function_flow[old_function_flow_i]) {
    next_in_flow = this.f_function_flow[old_function_flow_i];
    next_method_name = next_in_flow.name;
    next_method = this[next_method_name];
  }
  else {
    // @TODO Will I be handling f_function_flow finishes here as well?
  }

  // Check if all data is present in order to call the next method and bump
  // function_flow_i and bump the tries property of a f_function_flow element.
  if (next_in_flow && next_method_name && typeof next_method === 'function') {
  
    if (next_in_flow.tries !== '?' &&
        next_in_flow.tries > next_in_flow.max_tries) {
      // @TODO handle max_tries exceed
    }

    // Execute below only if its sure that `next` is going to be called
    this.f_flow_i++;
    next_in_flow.tries++;
    next_method.apply(this, arguments.length ? arguments : undefined);
  }
  else {
    // @TODO Handle if no next
  }

};