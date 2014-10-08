var assert = require('assert');

var f_ = require(__dirname + './../../index.js'),
    TaskList = require('./../lib/TaskList.js'),
    taskListObject = require('./../lib/taskList_object.js');


describe('f_.augment', function (){

  describe('#undefined toAugment', function (){
    it('should throw when no or undefined `toAugment` is given', function (done){
      try { TaskList = f_.augment(undefined); }
      catch(e){ done(); }
    });

    it('should throw `!toAugment Class|Object given`', function (done){
      try { TaskList = f_.augment(undefined); }
      catch(e){
        assert.equal(e, '!toAugment Class|Object given');
        done();
      }
    });
  }); // / undefined toAugment


  describe('#wrong toAugment type', function (){
    it('should throw when `typeof toAugment` does not equal `function` OR `object` ', function (done){
      try { TaskList = f_.augment('wrong type'); }
      catch(e){ done(); }
    });

    it('should throw `wrong toAugment type, !function`', function (done){
      try { TaskList = f_.augment('wrong type'); }
      catch(e){
        assert.equal(e, 'wrong toAugment type, !function && !object');
        done();
      }
    });

  });

  describe('#no options', function (){
    it('should throw when no options are given', function (done){
      try { TaskList = f_.augment(TaskList); }
      catch(e){ done(); }
    });

    it('should throw `wrong config type, !object`', function (done){
      try { TaskList = f_.augment(TaskList, 'wrong type'); }
      catch(e){
        assert.equal(e, 'wrong config type, !object');
        done();
      }
    });
  });

  describe('#no functionFlow', function (){
    it('should throw when no functionFlow is given in options', function (done){
      try { TaskList = f_.augment(TaskList, {}); }
      catch(e){ done(); }
    });

    it('should throw `!config.functionFlow, f_ needs to know which methods to call`', function (done){
      try { TaskList = f_.augment(TaskList, {}); }
      catch(e){
        assert.equal(e, '!config.functionFlow, f_ needs to know which methods to call');
        done();
      }
    });
  });

  describe('#wrong functionFlow', function (){
    it('should throw when wrong functionFlow is given', function (done){
      try { TaskList = f_.augment(TaskList, {functionFlow: 'wrong type'}); }
      catch(e){ done(); }
    });

    it('should throw `wrong config.functionFlow type, !array`', function (done){
      try { TaskList = f_.augment(TaskList, {functionFlow: 'wrong type'}); }
      catch(e){
        assert.equal(e, 'wrong config.functionFlow type, !array');
        done();
      }
    });
  });

  describe('#default log', function (){

    it('should have set f_.toLog to [] when `toLog` is undefined', function (){
      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
      });

      assert.equal(TaskList.prototype.f_toLog.length, 0);
    });

  });

  describe('#default maxTries.wholeList', function (){
    it('should set `maxTries.wholeList` to `10` when it\'s given a wrong maxTries.wholeList', function (){
      
      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        maxTries: { notWholeList: 5 }
      });

      assert.equal(TaskList.prototype.f_maxTries.wholeList, 10);
    });
  });

  describe('#augment object', function (){
    it('should be able to augment a plain object', function (done){
      
      TaskList = f_.augment(taskListObject, {
        functionFlow: ['getSource', 'writeSource', 'notify']
      });

      taskList = f_.setup(TaskList);

      // Just a random property to check if it worked
      assert.equal(typeof taskList.f_next, 'function');
      done();

    });

    it('should be able to run the same as with a function / class', function (done){
      TaskList = f_.augment(taskListObject, {
        functionFlow: ['getSource', 'writeSource', 'notify']
      });
      taskList = f_.setup(TaskList);
      taskList.start();
      taskList.onFinish = done();
    });

  });


  describe('#maxTries.allMethods', function (){
    it('should have set maxTries for all methods to the given allMethods value', function (done){
      var retryValue = 5,
          m1 = 'getSource', m2 = 'writeSource', m3 = 'notify';

      TaskList = f_.augment(TaskList, {
        functionFlow: [m1, m2, m3],
        maxTries: { allMethods: retryValue }
      });

      assert.equal(TaskList.f_maxTries[m1], retryValue);
      assert.equal(TaskList.f_maxTries[m2], retryValue);
      assert.equal(TaskList.f_maxTries[m3], retryValue);

      done();
    });
  });

});