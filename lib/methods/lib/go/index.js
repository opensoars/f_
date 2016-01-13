/**
 * Alias for f_next(). Looks a lot better when calling for 1st time.
 * Passes all arguments like f_next does.
 * @module methods/go
 * @return {object} this
 * @example
 * instance.f_go();
 * instance.f_next();
 */
module.exports = function f_go() {
  this.f_next.apply(this, arguments.length ? arguments : undefined);
  return this;
};
