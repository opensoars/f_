var Download = function Download() {};

Download.prototype.start = function () {
  //console.log('start called');
  this.f_next(/*'arg0 (from start)', {arg1: true}, ['arg2']*/);
};
Download.prototype.method1 = function () {
  //console.log('method1 called', arguments);
  this.f_next(/*'arg0 (from method1)'*/);
};
Download.prototype.method2 = function (test) {
  //Math.random() > 0.05
  //  ? this.f_retryAll('Retry error message')
  //  : this.f_next()
  //console.log('method2 called', arguments);
  //this.f_next();

  //this.f_retryAll('Retry error message');

  this.f_abort('Intentional abort');
};


module.exports = Download;