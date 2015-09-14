var Ezlog = require('ezlog'),
		log = new Ezlog({ p: {t:'[TaskList]', c:'green'} });


var TaskList = function TaskList (o){
  o = o || {};
  for(var key in o) this[key] = o[key]
  
  return this;
};


var proto = {};


/**
 * @method start         Check if requirements are met
 * @req    url {string}  Url to grab source code from
 */
proto.start = function (){
	//log("startin' task");

	var self = this;

	self.d.hello = 'world';

	if(self.retryMethodOnceFromFirst){
		self.retryMethodOnceFromFirst = false;

		function cb(){ self.f_next(); }

		return self.f_retryMethod(
			'getSource', cb, '@start self.retryMethodOnceFromFirst'
		);
	}

	// Let's start the f_ task list
	self.f_next();

	// Make chains possible
	return self;
};


/**
 * @method getSource          Gets a website source code
 * @data   d.source {string}  Website it's source code
 */
proto.getSource = function (retryMethod){

	var self = this;

	self.d = { hello: 'world' };

	if(self.abort)
		return self.f_abort('abort @getSource', new Error('Node err'));

	if(self.exceedRetries)
		return self.f_retryAll('exceedRetries @getSource', new Error('Node err'));

	if(self.emptyRetryErr){
		self.emptyRetryErr = false;
		return self.f_retryAll();
	}

	if(self.emptyAbortErr) return self.f_abort();

	if(self.randomTimeout)
		return setTimeout(function (){
			self.f_next();
		}, Math.round( (Math.random() * 40) + 10 ));
	

	self.f_next();
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

	if(self.retryFromOnceWithoutInfo){
		self.retryFromOnceWithoutInfo = false;
		
		return self.f_retryFrom('writeSource');
	}

	if(self.retryFromOnceWithWrongMethod){
		self.retryFromOnceWithWrongMethod = false;
		return self.f_retryFrom('wrongMethod', 'retryFromOnce @notify');
	}

	if(self.retryFromOnceWithWrongMethodWithoutInfo){
		self.retryFromOnceWithWrongMethodWithoutInfo = false;
		return self.f_retryFrom('wrongMethod');
	}

	if(self.retryMethodOnce){
		self.retryMethodOnce = false;

		function cb(){
			log(cb);
			self.f_next();
		}

		return self.f_retryMethod('writeSource', cb, 'self.retryMethodOnce');
	}

	if(self.retryMethodOnceWithoutCb){
		self.retryMethodOnce = false;
		return self.f_retryMethod('writeSource', undefined, 'self.retryMethodOnce');
	}


	if(self.retryMethodOnceWithoutInfo){
		self.retryMethodOnceWithoutInfo = false;
		function cb(){
			self.f_next();
		}
		return self.f_retryMethod('writeSource', cb);
	}

	if(self.retryMethodOnceWithWrongMethod){
		self.retryMethodOnceWithoutInfo = false;
		function cb(){
			self.f_next();
		}
		return self.f_retryMethod('wrongMethod', cb);
	}

	return self.f_next();

};

proto.writeDir = './sourceCodes';


TaskList.prototype = proto;


module.exports = TaskList;