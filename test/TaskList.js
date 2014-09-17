var Ezlog = require('ezlog'),
		log = new Ezlog({pref:{t:'[TaskList]',c:'green'}});


var TaskList = function TaskList (o){
  o = o || {};

  for(var key in o) this[key] = o[key]
  
  return this;
};


var proto = Object.create(null);

/**
 * @method start         Check if requirements are met
 * @req    url {string}  Url to grab source code from
 */
proto.start = function (){
	//log("startin' task");

	this.d.hello = 'world';

	return this.f_next();
};


/**
 * @method getSource          Gets a website source code
 * @data   d.source {string}  Website it's source code
 */
proto.getSource = function (){
	var self = this;

	self.d = { hello: 'world' };

	if(self.abort) return self.f_abort('Debugger abort', new Error('Node err here'))

	if(self.exceedRetries)
		return self.f_retryAll('Debugger retry, exceed max', new Error('Node err here'));

	if(self.emptyRetryErr) return self.f_retryAll();

	if(self.emptyAbortErr) return self.f_abort();

	return self.f_next();
};


/**
 * @method writeSource        Writes a source code on HD
 * @req    d.source {string}  Website it's source page
 */
proto.writeSource = function (){

	var self = this;

	if(self.retryAllOnce){
		self.retryAllOnce = false;
		return self.f_retryAll('Debugger retry', new Error('Node err here'));
	}


	if(self.retryThis){
		self.retryThis = false;
		return self.f_retryThis();
	}

	return self.f_next();
};


/**
 * @method notify  Log what happened in the previous methods
 */
proto.notify = function (){
	var self = this;

	return self.f_next();
};


proto.onRetryAll = function (){

};

proto.onNext = function (nextData){
	//log('!onNext!' + JSON.stringify(nextData));
};

proto.onFinish = function (){
	//log('!onFinish!');
};

proto.onAbort = function (){
	//log('!onAbort!');
};



// Adding data to Class proto object, will be same in every instance.
// No need to add in our shared data object namespace, which could be reset.
// Also using the proto object, we will only assign it once.
proto.writeDir = './sourceCodes';

TaskList.prototype = proto;


module.exports = TaskList;