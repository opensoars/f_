if (!process.ROOT_DIR) {
  throw new Error('!process.ROOT_DIR');
}

/** Require all f_ task list methods. */
var methods = process.ROOT_REQUIRE('./lib/methods');


/**
 * @module
 *
 * @param {function} constructor - Constructor to set f_ proto data to
 *
 * @return {function} constructor - Modified constructor, with f_ proto data
 */
function prototype(constructor) {





  return constructor;
};





module.exports = prototype;