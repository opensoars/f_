var Ezlog = require('ezlog'),
		log = new Ezlog({pref:{t:'[TaskList]',c:'green'}});


function TaskList (o){
  o = o || {};

  //log('TaskList initialized');

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
	//log("gettin' source");

	var self = this;

	if(Math.random() > 0.3)
		return self.f_retryAll('Debugger retry', new Error('Node err here'));


	return self.f_next();
};

/**
 * @method writeSource        Writes a source code on HD
 * @req    d.source {string}  Website it's source page
 */
proto.writeSource = function (){
	//log("writin' souce");

	var self = this;

	return self.f_next();
};

/**
 * @method notify  Log what happened in the previous methods
 */
proto.notify = function (){
	//log('HELLO notify');

	var self = this;

	return self.f_next();
};


proto.onRetryAll = function (){

};

proto.onNext = function (nextData){
	//log('!onNext!' + JSON.stringify(nextData));
};

proto.onFinish = function (){
	log('!onFinish!');
};

proto.onAbort = function (){
	//log('!onAbort!');
};



// Adding data to Class prototype object, will be same in every instance.
// No need to add in our shared data object namespace, which could be reset.
// Also using the prototype object, we only assign it once.
proto.writeDir = './sourceCodes';

TaskList.prototype = Object.create(proto);


module.exports = TaskList;