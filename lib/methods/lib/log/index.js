module.exports = function f_log(message) {
  var log_obj = {
    time: new Date().getTime(),
    message: message,
    flow_function: this.f_function_flow[this.f_flow_i-1].name
  };

  this.f_logs.push(log_obj);

  this.emit('log', log_obj);
};