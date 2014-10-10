var qs = require('querystring');

function GET(req, res){

  this.req = req;
  this.res = res;

}

var proto = {};

proto.start  = function (){

  if(!this.req) return this.f_abort('@GET.start', '!this.req');
  if(!this.res) return this.f_abort('@GET.start', '!this.res');

  this.f_next();

  return this;
};

proto.getQs = function (){
  this.d.qs = this.req.url.slice(2);
  
  this.f_next();
};

proto.collectInfo = function (){
  this.d.info = qs.parse(this.d.qs);

  this.f_next();
};

proto.end = function (){
  this.f_next();

  this.removeFromStack();
};


proto.onAbort = function (){
  this.res.end('abort!');
};

proto.onFinish = function (){
  this.res.end('finish!');
};

GET.prototype = proto;


module.exports = {
  tasks: GET,

  f_config: {
    functionFlow: ['getQs', 'collectInfo', 'end'],
    toLog: ['all']
  }
};