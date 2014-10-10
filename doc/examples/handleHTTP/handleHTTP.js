// Enviroment variables
process.PORT = 8888;


// Native modules
var http = require('http');


// Custom modules
var f_ = require('./../../../index.js'),
    requester = require('./requester.js');


// Create handlers namespace
var handlers = {

  GET: function (){
    var GET = require('./handlers/GET.js')
    return f_.augment(GET.tasks, GET.f_config);
  }()

};


var handlerStack = [];

handlerStack.remove = function (handler){
  this.splice(this.indexOf(handler, 1));
};

/** Initialize HTTP server
 * If there is a handler for the incoming method, spawn the handler.
 * Passing req and res.
 * If there ain't a hanlder, end with ''
 */
http.createServer(function (req, res){

  // Is there a handler?
  if(handlers[req.method]){

    var handlerInstance = f_.setup( new handlers[req.method](req, res) );


    handlerInstance.removeFromStack = function (){
      handlerStack.remove(this);
    };

    handlerStack.push(handlerInstance);

    handlerInstance.start();
  }


  // If there ain't a handler
  else res.end('');

}).listen(process.PORT);