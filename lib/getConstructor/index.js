/**
 * @module getConstructor
 */

var events = require('events');

var f_methods = process.ROOT_REQUIRE('./lib/f_methods'),
    f_instance_modules = process.ROOT_REQUIRE('./lib/f_instance_modules');


/**
 * @param {object} o
 */
module.exports = function getConstructor(o) {

  var Constructor = function f_Constructor() {
    var self = this;

    for (var module_name in f_instance_modules) {
      if (f_instance_modules.hasOwnProperty(module_name)) {
        self['f_' + module_name] = f_instance_modules[module_name];
      }
    }

    self.f_function_flow = [];
    
    o.function_flow.forEach(function (flow) {
      var new_flow_object = { tries: 0 };
      for (var property in flow) {
        if (flow.hasOwnProperty(property)) {
          if (property !== 'function') {
            new_flow_object[property] = flow[property];
          }
        }
      }
        
      self.f_function_flow.push(new_flow_object)
    });

    // Finaly call user specified initializer
    if (o.initializer) o.initializer.apply(self);
  };

  for (var method_name in f_methods) {
    if (f_methods.hasOwnProperty(method_name)) {
      Constructor.prototype['f_' + method_name] = f_methods[method_name];
    }
  }

  Constructor.prototype.__proto__ = events.EventEmitter.prototype;

  return Constructor;
};

