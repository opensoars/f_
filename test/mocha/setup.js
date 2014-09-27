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



  describe('#method tries set to 0 if method maxTries is given', function (){
    it('should have set f_.tries.getSource to 1', function (){
      

      var taskList = f_.setup( new (f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        toLog: ['start'],
        maxTries: {
          getSource: 1
        }
      })) );

      console.log(taskList);

      assert.equal(taskList.f_tries['getSource'], 1);


    });
  });


});