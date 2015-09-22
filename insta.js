var f_ = require('./index.js');

var Download = f_.set.prototype(require('./tests/fixtures/Download'), {
  function_flow: [
    { name: 'method1' },
    { name: 'method2' }
  ]
});


var dl = f_.set.instance(new Download());

//dl.on('log', function (log_obj) {
//  console.log(log_obj);
//});

dl.on('finish', function () {
  console.log('finish');
});

dl.start();
dl.f_addErr('Fail');
dl.f_log('Cool from insta.js');

//console.log(dl._events);
//console.log(dl);
//dl.start();

/*var f_ = {
  set: {
    prototype: function () {
    },
    instance: function (instance) {
      instance.f_ = instance.f_ || {};
      instance.f_.errs = [];
      return instance;
    },
    object: function () {}
  }
}

var Download = function Download (init_o) {
  this.name = init_o.name;
  console.log('Download initialized, name:', this.name);
};


var dl1 = f_.set.instance(new Download({ name: 'dl1' })),
    dl2 = f_.set.instance(new Download({ name: 'dl2' }));


console.log(dl1);
*/

/*var f_ = require('./index.js');


var dl1 = require('./tests/fixtures/Download_instance_rdy');
var dl2 = require('./tests/fixtures/Download_instance_rdy');

dl1.name = 'dl1';
dl2.name = 'dl2';


//console.log(dl1.__proto__);
//console.log(dl2.__proto__);

dl1.f_.addErr('err1');
dl2.f_.addErr('err2');

console.log('dl1.f_.errs', dl1.f_.errs);
console.log('dl2.f_.errs', dl2.f_.errs);*/

/*
var Download = require('./tests/fixtures/Download');


Download = f_.set.prototype(Download, {
  prototype_options: true,
  function_flow: [
    { name: 'method1', max_tries: 10 },
    { name: 'method2', max_tries: '?' }
  ]
});

var download = f_.set.instance(new Download(), {
  instance_options: true
});

download.start();*/