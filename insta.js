var f_ = require('./index.js');


var Download = f_.getConstructor({

  initializer: function () {
    //console.log('initializer called, this:', this);
    //this.on('f_log', function () { console.log('log!'); });
    this.f_log('Log from initializer');
    this.f_err('Err from initializer');

    this.f_next();
  },

  function_flow: [
    {
      name: 'start',
      function: function start() {
        console.log('start');
        this.f_next();
      },
      max_tries: 3
    },
    {
      name: 'method1',
      function: function method1() {
        console.log('method1');
      },
      max_tries: 2
    },
    {
      name: 'method2',
      function: function method2() {
        console.log('method2');
      },
      max_tries: 1
    }
  ]
});


var dl = new Download();
//dl.on('log', function (log_object) { console.log('log called', log_object); });
//dl.f_log('test');

//dl.f_err('Fail!');
//console.log(dl);