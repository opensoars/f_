module.exports = function f_addErr(message) {
  var err_object = {
    time: new Date().getTime(),
    error: new Error(message)
  };

  this.f_errs.push(err_object);

  this.emit('addErr', err_object);
};