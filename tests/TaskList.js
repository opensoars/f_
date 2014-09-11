var Ezlog = require('ezlog'),
		log = new Ezlog({pref:{t:'[TaskList]',c:'green'}});


var TaskList = function TaskList (o){
  o = o || {};

  //log('TaskList initialized');

  return this;
};



/**
 * @method start         Check if requirements are met
 * @req    url {string}  Url to grab source code from
 */
TaskList.prototype.start = function (){
	//log("startin' task");

	this.d.hello = 'world';

	return this.f_next();
};

/**
 * @method getSource          Gets a website source code
 * @data   d.source {string}  Website it's source code
 */
TaskList.prototype.getSource = function (){
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
TaskList.prototype.writeSource = function (){
	//log("writin' souce");

	var self = this;

	return self.f_next();
};

/**
 * @method notify  Log what happened in the previous methods
 */
TaskList.prototype.notify = function (){
	//log('HELLO notify');

	var self = this;

	console.log(this.f_desc);

	return self.f_next();
};


TaskList.prototype.onRetryAll = function (){

};

TaskList.prototype.onNext = function (nextData){
	//log('!onNext!' + JSON.stringify(nextData));
};

TaskList.prototype.onFinish = function (){
	log('!onFinish!');
};

TaskList.prototype.onAbort = function (){
	//log('!onAbort!');
};



// Adding data to Class prototype object, will be same in every instance.
// No need to add in our shared data object namespace, which could be reset.
// Also using the prototype object, we only assign it once.
TaskList.prototype.writeDir = './sourceCodes';


module.exports = TaskList;