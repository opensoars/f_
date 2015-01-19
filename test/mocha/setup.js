var assert = require('assert');

var f_ = require(__dirname + './../../index.js'),
    TaskList = require('./../lib/TaskList.js');


describe('f_.setup', function (){


  describe('#undefined instance', function (){
    it('should throw when no or undefined instance is given', function (done){
      try { f_.setup(undefined); } catch(e){ done(); }
    });

    it('should throw `no instance given`', function (){
      try { f_.setup(undefined); }
      catch(e){ assert.equal(e, 'no instance given'); }
    });
  });

  describe('#wrong instance type', function (){
    it('should throw when wrong instance type is given', function (done){
      try { f_.setup('wrong type'); } catch(e){ done(); }
    });

    it("should throw `typeof instance !== 'object'`'", function (){
      try { f_.setup('wrong type'); }
      catch(e){ assert.equal(e, "typeof instance !== 'object'"); }
    });
  });



  describe('#method tries default', function (){
    it('should have set `f_.max_tries.getSource` to `0`', function (){
      
      var taskList = f_.setup( new (f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify'],
        max_tries: { getSource: 2 }
      })) );

      assert.equal(taskList.f_tries['getSource'], 0);
    });
  });


  describe('method max_tries defaults', function (){
    it('should be set to `10`', function (){
      var taskList = f_.setup( new (f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify']
      })) );

      assert.equal(taskList.f_max_tries['getSource'], 10);
    });
  });


});