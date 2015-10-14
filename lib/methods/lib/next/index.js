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

  if (next_flow) {
    if (next_flow.tries >= next_flow.max_tries) {
      this.f_abort(next_flow.name + '.tries >= ' + next_flow.name +
        '.max_tries');
    }
    else if (this[next_flow.name] &&
             typeof this[next_flow.name] === 'function') {
      // Execute below only if its sure that `next` is going to be called
      this.f_flow_i++;
      next_flow.tries++;
      this[next_flow.name].apply(
        this,
        arguments.length ? arguments : undefined
      );

      /**
       * @TODO which data to pass, desc
       * Next event.
       * @event next
       */
      this.emit('next');
    }
  }
  else {
    // f_next gets called in the last method in function_flow
    if (this.f_flow_i === this.f_function_flow.length) {
      /**
       * @TODO which data to pass, desc
       * Finish event.
       * @event finish
       */
      this.emit('finish');
    }
    else {
      this.f_abort('@TODO No function to call');
      console.log('@TODO No function to call');
    }
  }

  return this;
};