/**
 * Alias for f_next(). Looks a lot better when calling for 1st time.
 * Passes all arguments like f_next does.
 * @module methods/go
 * @return {object} this
 */
module.exports = function f_go() {
  this.f_next(arguments.length ? arguments : undefined);
  return this;
};