var events = require('events');

var Err = process.ROOT_REQUIRE('./lib/Err');


var f_methods = process.ROOT_REQUIRE('./lib/methods'),
    f_instance_modules = process.ROOT_REQUIRE('./lib/instance_modules');

/**
 * @module getConstructor
 * @param {object} con_o - Constructor options
 */
module.exports = function getConstructor(con_o) {

  // Sanitize constructor options
  if (!con_o || typeof con_o !== 'object') {
    return Err('f_.getConstructor requires an options object');
  }
  if (!con_o.function_flow || !(con_o.function_flow instanceof Array)) {
    return Err('f_.getConstructor requires an options object with an ' + 
      'function_flow array in it');
  }

  /** These properties get set to every f_ instance */
  var f_instance_properties = {
    flow_i: 0
  };

  // @TODO desc for con_o defaults
  con_o.custom_prototype = con_o.custom_prototype || {};

  /**
   * The constructor returned when getConstructor is called.
   * @TODO Module this, split split!
   * @constructor
   * @param {object} ins_o - Instance options
   * @example
   * new f_Constructor({ a: 'b' }) // { a: 'b' }
   */
  function f_Constructor(ins_o) {
    var self = this;

    // Sanitize instance options
    if (!ins_o || typeof ins_o !== 'object') {
      ins_o = {};
    }
    if (!ins_o.custom_data || typeof ins_o.custom_data !== 'object') {
      ins_o.custom_data = {};
    }

    // Apply instance modules and properties
    for (var module_name in f_instance_modules) {
      /* istanbul ignore else  */
      if (f_instance_modules.hasOwnProperty(module_name)) {
        self['f_' + module_name] = f_instance_modules[module_name];
      }
    }

    // Apply instance options
    // Create data namespace, store name as f_data_namespace
    var data_namespace = con_o.data_namespace ||
      ins_o.data_namespace || 'data';
    self[data_namespace] = ins_o.custom_data;
    self.f_data_namespace = data_namespace;

    /** @TODO write desc for f_function_flow */
    self.f_function_flow = [];

    for (var property_name in f_instance_properties) {
      /* istanbul ignore else  */
      if (f_instance_properties.hasOwnProperty(property_name)) {
        self['f_' + property_name] = f_instance_properties[property_name];
      }
    }

    // Create instance function_flow, this in order to track tries
    con_o.function_flow.forEach(function (flow) {
      var new_flow_object = { tries: 0 };
      for (var property in flow) {
        /* istanbul ignore else  */
        if (flow.hasOwnProperty(property)) {
          if (property !== 'function') {
            new_flow_object[property] = flow[property];
          }
        }
      }
      self.f_function_flow.push(new_flow_object);
    });

    // Finaly, call user specified initializer and pass the instance options
    // custom data as the first argument
    if (con_o.initializer) {
      con_o.initializer.apply(self, [ins_o.custom_data]);
    }
  }

  // f_Constructor prototype properties

  // Inherit node events
  f_Constructor.prototype = Object.create(events.EventEmitter.prototype);

  // Set custom prototype properties
  for (var proto_key in con_o.custom_prototype) {
    /* istanbul ignore else  */
    if (con_o.custom_prototype.hasOwnProperty(proto_key)) {
      f_Constructor.prototype[proto_key] = con_o.custom_prototype[proto_key];
    }
  }

  // Set f_ methods to the constructor prototype, prefixed with f_
  for (var method_name in f_methods) {
    /* istanbul ignore else  */
    if (f_methods.hasOwnProperty(method_name)) {
      f_Constructor.prototype['f_' + method_name] = f_methods[method_name];
    }
  }

  // Set function_flow methods to the constructor prototype
  con_o.function_flow.forEach(function (flow) {
    f_Constructor.prototype[flow.name] = flow.function;
  });

  return f_Constructor;
};