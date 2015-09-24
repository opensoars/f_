/**
 * f_.next method module.
 * @TODO desc, clean code, FIX `f_function_flow` prototype scope!!!!!!!!!
 * @module methods/next
 * @example
 * // Results in the calling of the next method in the `f_function_flow`
 * this.f_next('arg0', 'arg1');
 */
module.exports = function f_next() {
  /**
   * Needed cuz `this.f_flow_i` should be bumped before the
   * corresponding f_function_flow method is called.
   * @type number
   */
  var old_function_flow_i = this.f_flow_i;

  var next_in_flow,
      next_method_name,
      next_method;

  // @TODO handle reqs
  if (!this.f_function_flow) {}

  // @TODO desc
  if (this.f_function_flow[old_function_flow_i]) {
    next_in_flow = this.f_function_flow[old_function_flow_i];
    next_method_name = next_in_flow.name;
    next_method = this[next_method_name];
  }

  // Check if all data is present in order to call the next method and bump
  // function_flow_i and bump the tries property of a f_function_flow element.
  if (next_in_flow && next_method_name && typeof next_method === 'function') {

    // Exceeding max_tries for current function in flow? If so abort
    if (next_in_flow.tries !== '?' &&
        next_in_flow.tries >= next_in_flow.max_tries) {
      // @TODO handle max_tries exceed, what data to pass
      return this.f_abort('max_tries exceeded for: ' + next_in_flow.name);
    }


    // FUUUUUUUUUUUUUUUUUUUUUUCK!!!!!!!!!!!!!!!!!!!!
    // f_function_flow cannot be bound to prototype scope!!!!!!!!!!!!!!!!!
    // f_function_flow cannot be bound to prototype scope!!!!!!!!!!!!!!!!!
    // f_function_flow cannot be bound to prototype scope!!!!!!!!!!!!!!!!!
    // FUUUUUUUUUUUUUUUUUUUUUUCK!!!!!!!!!!!!!!!!!!!!

    // Execute below only if its sure that `next` is going to be called
    this.f_flow_i++;
    next_in_flow.tries++;
    next_method.apply(this, arguments.length ? arguments : undefined);

    /**
     * @TODO which data to pass, desc
     * Log event.
     * @event next
     */
    this.emit('next');
    // @TODO log event!
  }
  else if (this.f_function_flow.length === this.f_flow_i) {
    // @TODO which data to pass
    this.emit('finish');
    // @TODO log event!
  }
  else {
    // @TODO handle `next fail`
    // ??? this.f_abort();
    // @TODO log event!
  }

};