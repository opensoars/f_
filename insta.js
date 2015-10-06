var f_ = require('./index.js');


function log(message) {
  console.log('[dl]', message);
}


var Download = f_.getConstructor({

  data_namespace: 'd',

  initializer: function () {
    //this.f_log('Log from initializer');
    //this.f_err('Err from initializer');
    this.f_log('init');
  },

  function_flow: [
    {
      name: 'start',
      function: function start() {
        log('start');
        this.f_next();
      },
      max_tries: 3
    },
    {
      name: 'method1',
      function: function method1() {
        log('method1');
        this.f_next();
      },
      max_tries: 2
    },
    {
      name: 'method2',
      function: function method2() {
        log('method2');

        this.f_retryAll('Test @method2');

        //this.f_next();
      },
      max_tries: 1
    }
  ]
});


var dl = new Download();

//dl.on('abort', function (reason) {
//  log(reason);
//});

dl.f_go();

console.log(dl.f_err.data);

//dl.on('log', function (log_object) { console.log('log called', log_object); });
//dl.f_log('test');

//dl.f_err('Fail!');
//console.log(dl);