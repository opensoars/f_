var qs = require('querystring');


/** GET handler class
 * @param req {object}  http server it's request
 * @param res {object}  http server it's response
 */
function GET(req, res){
  this.req = req;
  this.res = res;
}

var proto = {};

/** Starts our f_ task list
 * If !this.req or !this.res abort this task list
 * @return this {object}  Allows call chaining
 */
proto.start  = function (){

  if(!this.req) return this.f_abort('@GET.start', '!this.req');
  if(!this.res) return this.f_abort('@GET.start', '!this.res');

  this.f_next();

  return this;
};

/** Gets the querystring from req it's url
 * @d.qs {string}  Req querystring
 */
proto.getQs = function (){
  this.d.qs = this.req.url.slice(2);
  
  this.f_next();
};

/** Gets information from querystring
 * @d.info {object}  Our information object
 */
proto.collectInfo = function (){
  this.d.info = qs.parse(this.d.qs);

  this.f_next();
};

/** Closes task list
 * Will result in a f_finish call
 * Calls removeFromStack to clear this task list from our handlerStack
 */
proto.end = function (){
  this.f_next();

  this.removeFromStack();
};

/** Ends request
 * @method onAbort  Notifies user when we aborted the task list
 * @method onFinish  Notifies user when we finished the task list
 */
proto.onAbort = function (){
  this.res.end('abort!');
};

proto.onFinish = function (){
  this.res.end('finish!');
};


GET.prototype = proto;


/** Public exports
 * @prop tasks    {function}  Our getHandler task
 * @prop f_config {object}    getHandler it's f_config
 */
module.exports = {
  tasks: GET,

  f_config: {
    functionFlow: ['getQs', 'collectInfo', 'end'],
    toLog: ['all']
  }
};