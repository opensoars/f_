/**
 * Sets f_ functionality to a constructor function. 
 * @module set/prototype
 */

if (!process.ROOT_REQUIRE) {
  throw new Error('!process.ROOT_REQUIRE');
}

var events = require('events');

/** All f_ task list methods. */
var methods = process.ROOT_REQUIRE('./lib/methods');

/** Error "constructor", initialize to throw an error. */
var Err = process.ROOT_REQUIRE('./lib/Err');


/**
 * Binds f_ prototype functionality to the 1st argument. The 2nd options
 * argument allows configuration of the f_ functionality. Exported function.
 * @TODO decide whether all the logic in this function will be split up in
 * multiple functions or not.
 * @public
 * @param {function} Constructor - Constructor to set f_ proto data to
 * @param {object} o - `f_.set.prototype` options
 * @return {function} Constructor - Modified Constructor, with f_ proto data
 */
function setPrototype(Constructor, o) {
  /**
   * Scoped temp f_ holder which gets its properties bound
   * to `Constructor.prototype`.
   */
  var f_;

  if (!Constructor) {
    new Err('!Constructor, f_.set.prototype requires an constructor to add ' +
      ' f_ functionality to');
  }
  else if (!o) {
    new Err('!options.function_flow, f_.set.prototype requires an options ' +
      'object as 2nd argument');
  }
  else if (!o.function_flow || !(o.function_flow instanceof Array)) {
    new Err('!o.function_flow, f_.set.prototype requires an o ' +
      'object with a function_flow array property as 2nd argument');
  }

  f_ = Constructor.prototype.f_ || {};
  f_.function_flow = o.function_flow;
  

  // Set default data to each function_flow array flow element
  f_.function_flow.forEach(function (flow) {
    if (!flow.name) {
      new Err('!flow.name, f_.set.prototype requires each flow object in the ' +
        'function_flow array to have a name property');
    }

    flow.tries = 0;
    flow.max_tries = (flow.max_tries || flow.max_tries === 0)
      ? flow.max_tries
      : 10;
  });

  // Set Constructor f_ prototype methods
  for (var method in methods) {
    if (methods.hasOwnProperty(method)) {
      f_[method] = methods[method];
    }
  }

  // Set f_ properties to the Constructor its prototype
  for (var property in f_) {
    if (f_.hasOwnProperty(property)) {
      Constructor.prototype['f_' + property] = f_[property];
    }
  }

  // Inherit EventEmitter methods
  Constructor.prototype.__proto__ = events.EventEmitter.prototype;

  return Constructor;
}

module.exports = setPrototype;