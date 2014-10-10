process.PORT = 8888;


var http = require('http');

var f_ = require('./../../../index.js'),
    requester = require('./requester.js');


var handlers = {};



handlers.GET = f_.augment(require('./handlers/GET.js', {
  functionFlow: ['collectInfo'],
  toLog: ['all']
});


http.createServer(function (req, res){

  var m = req.method;

  if(handlers[m])
    return f_.setup( new handlers[m](req, res) ).start();

}).listen(process.PORT);





