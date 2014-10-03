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

	this.f_next();

	// Make chains possible
	return this;
};


/**
 * @method getSource          Gets a website source code
 * @data   d.source {string}  Website it's source code
 */
proto.getSource = function (){
	var self = this;

	self.d = { hello: 'world' };

	if(self.abort) return self.f_abort('abort @getSource', new Error('Node err here'));

	if(self.exceedRetries)
		return self.f_retryAll('exceedRetries @getSource', new Error('Node err here'));

	if(self.emptyRetryErr){
		self.emptyRetryErr = false;
		return self.f_retryAll();
	}

	if(self.emptyAbortErr) return self.f_abort();

	// Make it async
	setTimeout(function (){ self.f_next(); }, 1);
};


/**
 * @method writeSource        Writes a source code on HD
 * @req    d.source {string}  Website it's source page
 */
proto.writeSource = function (){

	var self = this;

	if(self.retryThisOnce){
		self.retryThisOnce = false;
		return self.f_retryThis('retryThisOnce @writeSource');
	}

	if(self.retryThisOnceWithoutInfo){
		self.retryThisOnceWithoutInfo = false;
		return self.f_retryThis();
	}

	if(self.retryAllOnce){
		self.retryAllOnce = false;

		return self.f_retryAll(
			'retryAllOnce @writeSource',
			'if(self.retryAllOnce)'
		);
	}

	return self.f_next();
};


/**
 * @method notify  Log about what happened in the previous methods
 */
proto.notify = function (){
	var self = this;

	if(self.retryFromOnce){
		self.retryFromOnce = false;

		return self.f_retryFrom(
			'writeSource',
			'retryFromOnce @notify',
			'self.retryFromOnce'
		);
	}

	return self.f_next();
};

/*
proto.onRetryThis = function (){
	log('!onRetryThis');
}

proto.onRetryAll = function (){

};

proto.onNext = function (nextData){
	//log('!onNext!' + JSON.stringify(nextData));
};

proto.onFinish = function (){
	//log('!onFinish!');
	clear()
};

proto.onAbort = function (){
	//log('!onAbort!');
};
*/


// Adding data to Class proto object, will be same in every instance.
// No need to add in our shared data object namespace, which could be reset.
// Also using the proto object, we will only assign it once.
proto.writeDir = './sourceCodes';

TaskList.prototype = proto;


module.exports = TaskList;