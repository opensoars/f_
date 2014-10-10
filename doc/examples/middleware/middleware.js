process.PORT = 8888;


var http = require('http');

var f_ = require('./../../../index.js'),
    requester = require('./requester.js');


var handlers = {};

function GET(req, res){

  this.req = req;
  this.res = res;

}

GET.prototype.start  = function (){

  if(!this.req) return this.f_abort('@GET.start', '!this.req');
  if(!this.res) return this.f_abort('@GET.start', '!this.res');


  this.f_next();
};

GET.prototype.collectInfo = function (){


  //this.d


  this.f_next();

};




handlers.GET = f_.augment(GET, {
  functionFlow: ['collectInfo'],
  toLog: ['all']
});


http.createServer(function (req, res){

  var m = req.method;

  if(handlers[m])
    return f_.setup( new handlers[m](req, res) ).start();

}).listen(process.PORT);





