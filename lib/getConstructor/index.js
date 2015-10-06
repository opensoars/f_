var events = require('events');

var Err = process.ROOT_REQUIRE('./lib/Err');

var f_methods = process.ROOT_REQUIRE('./lib/methods'),
    f_instance_modules = process.ROOT_REQUIRE('./lib/instance_modules');

/** @TODO FIX, desc f_instance_properties */
var f_instance_properties = {
  flow_i: 0
};


/**
 * @module getConstructor
 * @param {object} con_o - Constructor options
 */
module.exports = function getConstructor(con_o) {

  if (!con_o || typeof con_o !== 'object') {
    new Err('f_.getConstructor requires an options object');
  }
  else if (!con_o.function_flow || !(con_o.function_flow instanceof Array)) {
    new Err('f_.getConstructor requires an options object with an ' + 
      'function_flow array in it');
  }
  else {
    // @TODO handle other reqs
  }

  /**
   * The constructor returned when getConstructor is called.
   * @TODO Module this
   * @constructor
   * @param {object} ins_o - Instance options, overwrites f_
   */
  var f_Constructor = function f_Constructor(ins_o) {
    var self = this;

    if (!ins_o || typeof ins_o !== 'object') {
      ins_o = {};
    }

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

    // Create data namespace, store name as f_data_namespace
    var data_namespace = con_o.data_namespace ||
      ins_o.data_namespace || 'data';
    self[data_namespace] = {};
    self.f_data_namespace = data_namespace;

    /** @TODO write desc for f_function_flow */
    self.f_function_flow = [];

    // Create instance function_flow, this in order to track tries
    con_o.function_flow.forEach(function (flow) {
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
    if (con_o.initializer) {
      con_o.initializer.apply(self);
    }
  };

  // Set f_ methods to the constructor prototype, prefixed with f_
  for (var method_name in f_methods) {
    if (f_methods.hasOwnProperty(method_name)) {
      f_Constructor.prototype['f_' + method_name] = f_methods[method_name];
    }
  }

  // Set function_flow methods to the constructor prototype
  con_o.function_flow.forEach(function (flow) {
    f_Constructor.prototype[flow.name] = flow.function;
  });

  // Inherit node events
  f_Constructor.prototype.__proto__ = events.EventEmitter.prototype;

  return f_Constructor;
};

