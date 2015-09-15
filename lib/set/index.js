/**
 * Contains all functionality required to set f_ functionality to constructor
 * prototypes, instances and plain objects.
 * @module set
 * @example
 * f_.set.prototype(TasksConstructor, options);
 */
module.exports = {
  prototype: require('./lib/prototype'),
  instance: require('./lib/instance'),
  object: require('./lib/object')
};

