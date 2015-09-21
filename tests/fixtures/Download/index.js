/**
 * Download fixture. Used for dev and tests.
 */
var Download = function Download() {};

Download.prototype.start = function () {
  console.log('start called');
  this.f_next(/*'arg0 (from start)', {arg1: true}, ['arg2']*/);
};
Download.prototype.method1 = function () {
  console.log('method1 called', arguments);
  this.f_next(/*'arg0 (from method1)'*/);
};
Download.prototype.method2 = function (test) {
  console.log('method2 called', arguments);
  this.f_next();
};


module.exports = Download;