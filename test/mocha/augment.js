var assert = require('assert');

var f_ = require(__dirname + './../../index.js'),
    TaskList = require('./../lib/TaskList.js');


describe('#f_.augment', function (){

  describe('#undefined toAugment', function (){

    it('f_ should throw when no or undefined `toAugment` are given to `f_.augment`', function (done){

      try {
        TaskList = f_.augment(undefined, {
          functionFlow: ['getSource', 'writeSource', 'notify'],
          toLog: ['none']
        });

        taskList = new TaskList();
        taskList = f_.setup(taskList);
        taskList.start();
      } catch(e){ done(); }

    });

    it('f_ should throw `!toAugment Class|Object given`', function (done){

      try {
        TaskList = f_.augment(undefined, {
          functionFlow: ['getSource', 'writeSource', 'notify'],
          toLog: ['none']
        });

        taskList = new TaskList();
        taskList = f_.setup(taskList);
        taskList.start();
      } catch(e){
        assert.equal(e, '!toAugment Class|Object given');
        done();
      }

    });


  });

});

