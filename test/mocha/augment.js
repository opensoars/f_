var assert = require('assert');

var f_ = require(__dirname + './../../index.js'),
    TaskList = require('./../lib/TaskList.js');


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
    it('should throw when `typeof toAugment` does not equal `function` ', function (done){
      try { TaskList = f_.augment('wrong type'); }
      catch(e){ done(); }
    });

    it('should throw `wrong toAugment type, !function`', function (done){
      try { TaskList = f_.augment('wrong type'); }
      catch(e){
        assert.equal(e, 'wrong toAugment type, !function');
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

    it('should have set all log triggers when `toLog` is undefined', function (){
      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
      });

      assert.equal(TaskList.prototype.f_toLog.length, 6);
    });

  });

  describe('#default maxRetries.all', function (){
    it('should set `maxRetries.all` to 10 when it\'s given', function (){
      
      TaskList = f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        maxRetries: { noAll: 10 }
      });

      assert.equal(TaskList.prototype.f_maxRetries.all, 10);
    });
  });

});