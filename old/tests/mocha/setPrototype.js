var assert = require('assert');

var f_ = require(__dirname + './../../index.js'),
    TaskList = require('./../lib/TaskList.js'),
    taskListObject = require('./../lib/taskList_object.js');


describe('f_.setPrototype', function (){

  describe('#undefined to_set_on', function (){
    it('should throw when no or undefined `to_set_on` is given', function (done){
      try { TaskList = f_.setPrototype(undefined); }
      catch(e){ done(); }
    });

    it('should throw `!to_set_on constructor|object given`', function (done){
      try { TaskList = f_.setPrototype(undefined); }
      catch(e){
        assert.equal(e, '!to_set_on constructor|Object given');
        done();
      }
    });
  }); // / undefined to_set_on


  describe('#wrong to_set_on type', function (){
    it('should throw when `typeof to_set_on` does not equal `function` OR `object` ', function (done){
      try { TaskList = f_.setPrototype('wrong type'); }
      catch(e){ done(); }
    });

    it('should throw `wrong to_set_on type, !function`', function (done){
      try { TaskList = f_.setPrototype('wrong type'); }
      catch(e){
        assert.equal(e, 'wrong to_set_on type, !function && !object');
        done();
      }
    });

  });

  describe('#no options', function (){
    it('should throw when no options are given', function (done){
      try { TaskList = f_.setPrototype(TaskList); }
      catch(e){ done(); }
    });

    it('should throw `wrong config type, !object`', function (done){
      try { TaskList = f_.setPrototype(TaskList, 'wrong type'); }
      catch(e){
        assert.equal(e, 'wrong config type, !object');
        done();
      }
    });
  });

  describe('#no function_flow', function (){
    it('should throw when no function_flow is given in options', function (done){
      try { TaskList = f_.setPrototype(TaskList, {}); }
      catch(e){ done(); }
    });

    it('should throw `!config.function_flow, f_ needs to know which methods to call`', function (done){
      try { TaskList = f_.setPrototype(TaskList, {}); }
      catch(e){
        assert.equal(e, '!config.function_flow, f_ needs to know which methods to call');
        done();
      }
    });
  });

  describe('#wrong function_flow', function (){
    it('should throw when wrong function_flow is given', function (done){
      try { TaskList = f_.setPrototype(TaskList, {function_flow: 'wrong type'}); }
      catch(e){ done(); }
    });

    it('should throw `wrong config.function_flow type, !array`', function (done){
      try { TaskList = f_.setPrototype(TaskList, {function_flow: 'wrong type'}); }
      catch(e){
        assert.equal(e, 'wrong config.function_flow type, !array');
        done();
      }
    });
  });

  describe('#default log', function (){

    it('should have set f_.to_log to [] when `to_log` is undefined', function (){
      TaskList = f_.setPrototype(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify'],
      });

      assert.equal(TaskList.prototype.f_to_log.length, 0);
    });

  });

  describe('#default max_tries.whole_list', function (){
    it('should set `max_tries.whole_list` to `10` when it\'s given a wrong max_tries.whole_list', function (){
      
      TaskList = f_.setPrototype(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify'],
        max_tries: { not_whole_list: 5 }
      });

      assert.equal(TaskList.prototype.f_max_tries.whole_list, 10);
    });
  });

  describe('#setPrototype object', function (){
    it('should be able to setPrototype a plain object', function (done){
      
      TaskList = f_.setPrototype(taskListObject, {
        function_flow: ['getSource', 'writeSource', 'notify']
      });



      taskList = f_.setInstance(TaskList);

      // Just a random property to check if it worked
      assert.equal(typeof taskList.f_next, 'function');
      done();

    });

    it('should be able to run the same as with a function / constructor', function (done){
      TaskList = f_.setPrototype(taskListObject, {
        function_flow: ['getSource', 'writeSource', 'notify']
      });
      taskList = f_.setInstance(TaskList);
      taskList.start();
      taskList.onFinish = done();
    });

  });


  describe('#max_tries.all_methods', function (){
    it('should have set max_tries for all methods to the given all_methods value', function (done){
      var retry_count = 5,
          m1 = 'getSource', m2 = 'writeSource', m3 = 'notify';

      TaskList = f_.setPrototype(TaskList, {
        function_flow: [m1, m2, m3],
        max_tries: { all_methods: retry_count }
      });

      assert.equal(TaskList.f_max_tries[m1], retry_count);
      assert.equal(TaskList.f_max_tries[m2], retry_count);
      assert.equal(TaskList.f_max_tries[m3], retry_count);

      done();
    });
  });

});