/**
 * `f_next` method module.
 * @module methods/next
 * @TODO, split functionality,
 * @return {object} this
 * @example
 * // Results in the calling of the next method in the `f_function_flow`
 * this.f_next('arg0', 'arg1');
 */
module.exports = function f_next() {
  /**
   * Needed cuz `this.f_flow_i` should be bumped before the
   * corresponding f_function_flow method is called.
   * @type {number}
   */
  var old_function_flow_i = this.f_flow_i;

  /**
   * Instance f_function_flow array flow element.
   * @type {object}
   */
  var next_flow = this.f_function_flow[old_function_flow_i];

  // If there is an element in the function_flow array, try calling it
  // else abort.
  if (next_flow) {
    if (next_flow.tries >= next_flow.max_tries) {
      this.f_abort(next_flow.name + '.tries >= ' + next_flow.name +
        '.max_tries');
    }
    else if (this[next_flow.name]
             && typeof this[next_flow.name] === 'function') {
      this.f_flow_i++;
      next_flow.tries++;
      this[next_flow.name].apply(
        this,
        arguments.length ? arguments : undefined
      );

      /**
       * next event.
       * @event next
       */
      this.emit('next');
    }
    else {
      this.f_abort('Could not call a function_flow method');
    }
  }
  else {
    // f_next gets called from the last method of the function_flow
    if (this.f_flow_i === this.f_function_flow.length) {
      this.f_finish();
    }
    else {
      this.f_abort('No function to call, is there something wrong with'
        + ' f_function_flow');
    }
  }

  return this;
};