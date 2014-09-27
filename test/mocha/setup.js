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

});