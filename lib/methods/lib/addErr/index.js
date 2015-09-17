module.exports = function addErr(message) {
  this.f_errs.push({
    time: new Date().getTime(),
    error: new Error(message)
  });
};