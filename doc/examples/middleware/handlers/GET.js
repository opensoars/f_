function GET(req, res){

  this.req = req;
  this.res = res;

}

var proto = {};

proto.start  = function (){

  if(!this.req) return this.f_abort('@GET.start', '!this.req');
  if(!this.res) return this.f_abort('@GET.start', '!this.res');


  this.f_next();
};

proto.collectInfo = function (){


  //this.d


  this.f_next();

};

GET.prototype = proto;


module.exports = GET;