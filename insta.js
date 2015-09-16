var f_ = require('./index.js');


var Download = require('./tests/fixtures/Download');


Download = f_.set.prototype(Download, {
  prototype_options: true,

  // Hmmmm, which one?!
  /*function_flow: [
    'method1',
    'method2'
  ],*/
  function_flow: [
    { name: 'method1', max_tries: 10 },
    { name: 'method2', max_tries: '?' }
  ]
});

var download = f_.set.instance(new Download(), {
  instance_options: true
});

download.start();


/*
var Download = f_.getConstructor({

  function_flow: [
    {
      max_tries: 5,
      method1: function method1() {
        console.log(this);
      }
    },
    {
      max_tries: 5,
      method2: function method2() {

      }
    }
  ]


  function_flow: [
    (function () {
      var method1 = function method1() {
        console.log(this); this.f_next();
      };
      method1.max_tries = 5;
      return method1;
    }()),
    (function () {
      function method2() {
        this.f_next();
      };
      method2.max_tries = 10;
      return method2;
    }())
  ]

});

*/



/*
var Download = require('./tests/fixtures/Download');


Download = f_.set.prototype(Download, {
  prototype_options: true,

  // Hmmmm, which one?!
  function_flow: [
    'method1',
    'method2'
  ],
  function_flow: [
    { name: 'method1', max_tries: 10 },
    { name: 'method2', max_tries: '?' }
  ]
});

var download = f_.set.instance(new Download(), {
  instance_options: true
});

download.start();*/