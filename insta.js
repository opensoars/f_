var f_ = require('./index.js');

retried = false;

var instance = new (f_.getConstructor({
  function_flow: [
    {
      name: 'one',
      function: function () {
        this.f_next();
        //console.log(this.f_next());
      }
    },
    {
      name: 'two',
      function: function () {
       if (retried) {
          this.f_next();
        }
        else {
          retried = true;
          this.f_retryFrom('one');
        }

        //console.log(this.f_next());
      }
    }
  ]
}));

//console.log(instance);
instance.on('finish', function () {
  console.log('finish');
});

instance.on('retryFrom', function () {
  console.log('retryFrom');
});

instance.on('abort', function () {
  console.log('abort');
});

instance.f_go();

//console.log(instance);

/*var f_ = require('./index.js');


function log(message) {
  console.log('[dl]', message);
}


var Download = f_.getConstructor({

  //data_namespace: 'd',

  initializer: function (d) {
    //this.f_log('Log from initializer');
    //this.f_err('Err from initializer');
    log('init');
  },

  custom_prototype: {
    test: 123
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

var dl = new Download({
  custom_data: {
    test: 123
  },

  data_namespace: 'd'
});

//dl.on('abort', function (reason) {
//  log(reason);
//});


console.log(dl);
dl.f_go();



//console.log(dl);

//dl.on('log', function (log_object) { console.log('log called', log_object); });
//dl.f_log('test');

//dl.f_err('Fail!');
//console.log(dl);

*/

