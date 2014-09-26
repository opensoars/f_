var assert = require('assert');

var f_ = require(__dirname + './../../index.js'),
    TaskList = require('./../lib/TaskList.js');

describe('#logAll', function (){

  it('f_ should log progress ^ ^ ^', function (){

    TaskList = f_.augment(TaskList, {
      functionFlow: ['getSource', 'writeSource', 'notify'],
      toLog: ['all'],
      desc: 'logAll task list'
    });

    f_.setup( new TaskList() ).start();
  });

});