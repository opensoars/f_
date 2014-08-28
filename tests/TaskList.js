var Ezlog = require('ezlog');

var log = new Ezlog({
	pref: { t: '[TasksList]', c: 'green' }
});


var TaskList = function TaskList (o){
  o = o || {};

  log('TaskList init');

  return this;
};

/**
 * @method start         Check if requirements are met
 * @req    url {string}  Url to grab source code from
 */
TaskList.prototype.start = function (){

	log('TaskList start');

	this.f_next();

};

/**
 * @method getSource          Gets a website source code
 * @data   d.source {string}  Website it's source code
 */
TaskList.prototype.getSource = function (){
	log("gettin' source");

	var self = this;

	self.f_next();
};

/**
 * @method writeSource        Writes a source code on HD
 * @req    d.source {string}  Website it's source page
 */
TaskList.prototype.writeSource = function (){
	log("writin' souce");

	var self = this;

	self.f_next();
};

/**
 * @method notify  Log what happened in the previous methods
 */
TaskList.prototype.notify = function (){
	log('HELLO notify');

	var self = this;

	self.f_next();
};

// Adding data to Class prototype object, will be same in every instance.
// No need to add in our shared data object namespace, which could be reset.
// Also using the prototype object, we only assign it once.
TaskList.prototype.writeDir = './sourceCodes';

module.exports = TaskList;