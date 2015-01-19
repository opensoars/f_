var assert = require('assert');

var f_ = require(__dirname + './../../index.js'),
    TaskList = require('./../lib/TaskList.js'),
    taskListObject = require('./../lib/taskList_object.js');


describe('f_.augment', function (){

  describe('#undefined to_augment', function (){
    it('should throw when no or undefined `to_augment` is given', function (done){
      try { TaskList = f_.augment(undefined); }
      catch(e){ done(); }
    });

    it('should throw `!to_augment Class|Object given`', function (done){
      try { TaskList = f_.augment(undefined); }
      catch(e){
        assert.equal(e, '!to_augment constructor|Object given');
        done();
      }
    });
  }); // / undefined to_augment


  describe('#wrong to_augment type', function (){
    it('should throw when `typeof to_augment` does not equal `function` OR `object` ', function (done){
      try { TaskList = f_.augment('wrong type'); }
      catch(e){ done(); }
    });

    it('should throw `wrong to_augment type, !function`', function (done){
      try { TaskList = f_.augment('wrong type'); }
      catch(e){
        assert.equal(e, 'wrong to_augment type, !function && !object');
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

  describe('#no function_flow', function (){
    it('should throw when no function_flow is given in options', function (done){
      try { TaskList = f_.augment(TaskList, {}); }
      catch(e){ done(); }
    });

    it('should throw `!config.function_flow, f_ needs to know which methods to call`', function (done){
      try { TaskList = f_.augment(TaskList, {}); }
      catch(e){
        assert.equal(e, '!config.function_flow, f_ needs to know which methods to call');
        done();
      }
    });
  });

  describe('#wrong function_flow', function (){
    it('should throw when wrong function_flow is given', function (done){
      try { TaskList = f_.augment(TaskList, {function_flow: 'wrong type'}); }
      catch(e){ done(); }
    });

    it('should throw `wrong config.function_flow type, !array`', function (done){
      try { TaskList = f_.augment(TaskList, {function_flow: 'wrong type'}); }
      catch(e){
        assert.equal(e, 'wrong config.function_flow type, !array');
        done();
      }
    });
  });

  describe('#default log', function (){

    it('should have set f_.to_log to [] when `to_log` is undefined', function (){
      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify'],
      });

      assert.equal(TaskList.prototype.f_to_log.length, 0);
    });

  });

  describe('#default max_tries.whole_list', function (){
    it('should set `max_tries.whole_list` to `10` when it\'s given a wrong max_tries.whole_list', function (){
      
      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify'],
        max_tries: { not_whole_list: 5 }
      });

      assert.equal(TaskList.prototype.f_max_tries.whole_list, 10);
    });
  });

  describe('#augment object', function (){
    it('should be able to augment a plain object', function (done){
      
      TaskList = f_.augment(taskListObject, {
        function_flow: ['getSource', 'writeSource', 'notify']
      });

      taskList = f_.setup(TaskList);

      // Just a random property to check if it worked
      assert.equal(typeof taskList.f_next, 'function');
      done();

    });

    it('should be able to run the same as with a function / class', function (done){
      TaskList = f_.augment(taskListObject, {
        function_flow: ['getSource', 'writeSource', 'notify']
      });
      taskList = f_.setup(TaskList);
      taskList.start();
      taskList.onFinish = done();
    });

  });


  describe('#max_tries.allMethods', function (){
    it('should have set max_tries for all methods to the given allMethods value', function (done){
      var retryValue = 5,
          m1 = 'getSource', m2 = 'writeSource', m3 = 'notify';

      TaskList = f_.augment(TaskList, {
        function_flow: [m1, m2, m3],
        max_tries: { allMethods: retryValue }
      });

      assert.equal(TaskList.f_max_tries[m1], retryValue);
      assert.equal(TaskList.f_max_tries[m2], retryValue);
      assert.equal(TaskList.f_max_tries[m3], retryValue);

      done();
    });
  });

});