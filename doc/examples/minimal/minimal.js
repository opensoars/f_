var f_ = require('./../../../index.js');

function TaskList(){}

var Proto = {};

Proto.start     = function (){ this.f_next(); };
Proto.firstTask = function (){ this.f_next(); };
Proto.lastTask  = function (){ this.f_next(); };
Proto.onFinish  = function (){ console.log('onFinish'); };

TaskList.prototype = Proto;


TaskList = f_.augment(TaskList, { functionFlow: ['firstTask', 'lastTask'] });


for(var i=0; i<500; i+=1)
  f_.setup(new TaskList()).start();
