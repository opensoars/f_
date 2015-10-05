var events = require('events');

var f_methods = process.ROOT_REQUIRE('./lib/methods'),
    f_instance_modules = process.ROOT_REQUIRE('./lib/instance_modules');

/** @TODO FIX, desc f_instance_properties */
var f_instance_properties = {
  flow_i: 0
};


/**
 * @module getConstructor
 * @param {object} o
 */
module.exports = function getConstructor(o) {

  var Constructor = function f_Constructor() {
    var self = this;

    // Apply instance modules and properties
    for (var module_name in f_instance_modules) {
      if (f_instance_modules.hasOwnProperty(module_name)) {
        self['f_' + module_name] = f_instance_modules[module_name];
      }
    }

    for (var property_name in f_instance_properties) {
      if (f_instance_properties.hasOwnProperty(property_name)) {
        self['f_' + property_name] = f_instance_properties[property_name];
      }
    }

    /** @TODO write desc for f_function_flow */
    self.f_function_flow = [];

    // Create instance function_flow, this in order to track tries
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

    // Finaly, call user specified initializer
    if (o.initializer) {
      o.initializer.apply(self);
    }
  };

  // Set f_ methods to the constructor prototype, prefixed with f_
  for (var method_name in f_methods) {
    if (f_methods.hasOwnProperty(method_name)) {
      Constructor.prototype['f_' + method_name] = f_methods[method_name];
    }
  }

  // Set function_flow methods to the constructor prototype
  o.function_flow.forEach(function (flow) {
    Constructor.prototype[flow.name] = flow.function;
  });

  // Inherit node events
  Constructor.prototype.__proto__ = events.EventEmitter.prototype;

  return Constructor;
};

