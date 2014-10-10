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



http.createServer(function (req, res){

  if(handlers[req.method])
    return f_.setup( new handlers[req.method](req, res) ).start();

  else res.end('');

}).listen(process.PORT);





