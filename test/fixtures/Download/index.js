/**
 * Download fixture. Used for dev and tests.
 */
var Download = function Download() {};

Download.prototype.start = function () {
  console.log('download.start');
  console.log(this.f_.function_flow);
  //console.log(this.f_.d);

  this.f_.next();
};
Download.prototype.method1 = function () { console.log('method1'); };
Download.prototype.method2 = function () {};

module.exports = Download;