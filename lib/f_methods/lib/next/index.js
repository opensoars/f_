/**
 * `f_next` method module.
 * What does f_next do?
 * Check for a next flow
 * Check for tries
 * 
 * @module methods/next
 * @example
 * // Results in the calling of the next method in the `f_function_flow`
 * this.f_next('arg0', 'arg1');
 * @TODO, split functionality,
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
  var next_flow = this.f_function_flow[old_function_flow_i]

  console.log(next_flow);

  // Execute below only if its sure that `next` is going to be called
  this.f_flow_i++;
  next_flow.tries++;
  this[next_flow.name].apply(this, arguments.length ? arguments : undefined);

  /**
   * @TODO which data to pass, desc
   * Next event.
   * @event next
   */
  this.emit('next');
};