var f_ = require('../index.js');

var TaskList = function TaskList (o){
  o = o || {};

  return this;
};

/**
 * @method start         Check if requirements are met
 * @req    url {string}  Url to grab source code from
 */
TaskList.prototype.start = function (){

};

/**
 * @method getSource          Gets a website source code
 * @data   d.source {string}  Website it's source code
 */
TaskList.prototype.getSource = function (){

};

/**
 * @method writeSource        Writes a source code on HD
 * @req    d.source {string}  Website it's source page
 */
TaskList.prototype.writeSource = function (){

};

/**
 * @method notify  Log what happened in the previous methods
 */
TaskList.prototype.notify = function (){

};

// Adding data to Class prototype object, will be same in every instance.
// No need to add in our shared data object namespace, which could be reset.
// Also using the prototype object, we only assign it once.
TaskList.prototype.writeDir = './sourceCodes';

var f_config = {

	functionFlow: ['getSource', 'writeSource', 'notify']

};

TaskList = f_.augment(TaskList, f_config);

console.log(TaskList);

var taskListInstance = new TaskList();
taskListInstance = f_.setup(taskListInstance);

console.log(taskListInstance);
