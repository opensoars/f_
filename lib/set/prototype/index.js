if (!process.ROOT_REQUIRE) {
  throw new Error('!process.ROOT_REQUIRE');
}

/** Require all f_ task list methods. */
var methods = process.ROOT_REQUIRE('./lib/methods');

/** Error "constructor", initialize to throw an error. */
var Err = process.ROOT_REQUIRE('./lib/Err');


/**
 * @module
 *
 * @param {function} constructor - Constructor to set f_ proto data to
 * @param {object} options - `f_.set.prototype` options
 * @return {function} constructor - Modified constructor, with f_ proto data
 */
function prototype(constructor, options) {
  /**
   * Scoped f_ namespace which gets bound to `constructor.prototype`.
   * @namespace
   */
  var f_ = {};

  if (!constructor) {
    new Err('!constructor, f_.set.prototype requires an constructor to add ' +
      ' f_ functionality to');
  }
  else if (!options) {
    new Err('!options.function_flow, f_.set.prototype requires an options ' +
      'object as 2nd argument');
  }
  else if (!options.function_flow) {
    new Err('!options.function_flow, f_.set.prototype requires an options ' +
      'object with a function_flow array property as 2nd argument');
  }

  f_ = constructor.prototype.f_ || {};
  f_.function_flow = options.function_flow;

  // Set constructor f_ prototype methods
  for (var method in methods) {
    f_[method] = methods[method];
  }

  // Set constructor f_ prototype property
  constructor.prototype.f_ = f_;

  // Not sure about this.. Only if really needed! Laziness?
  constructor.prototype.f_.constructor = constructor;

  return constructor;
};





module.exports = prototype;