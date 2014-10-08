var assert = require('assert');

var f_ = require(__dirname + './../../index.js'),
    TaskList = require('./../lib/TaskList.js');


describe('functionFlow', function (){

  describe('#no next method', function (){

    it('should not throw', function (){
      f_.setup( new (f_.augment(TaskList, {
        functionFlow: ['this is not a method']
      })) ).start();
    });

    it('should abort', function (done){

      TaskList = f_.augment(TaskList, {
        functionFlow: ['this is not a method']
      });

      var taskList = new TaskList();
      taskList = f_.setup(taskList);
      taskList.onAbort = done;
      taskList.start();

    });

    it('should set f_status to `aborted`', function (done){

      TaskList = f_.augment(TaskList, {
        functionFlow: ['this is not a method']
      });

      var taskList = f_.setup( new TaskList() );
      taskList.onAbort = function (){
        assert.equal(this.f_status, 'aborted');
        done();
      };
      taskList.start();
    });

  });


  describe('#normal', function (){

    describe('#f_i', function (){
      it('should have set f_i to to functionFlow.length', function (done){

        TaskList = f_.augment(TaskList, {
          functionFlow: ['getSource', 'writeSource', 'notify']
        });

        var taskList = new TaskList();
        taskList = f_.setup(taskList);
        taskList.onFinish = function (){
          assert.equal(this.f_i, this.f_functionFlow.length);
          done();
        };
        taskList.start();
      });
    });

    describe('#method calling', function (){

      it('should give us an info object when onNext is called', function (done){

        var infoGiven = false;

        TaskList = f_.augment(TaskList, {
          functionFlow: ['getSource', 'writeSource', 'notify']
        });

        var taskList = new TaskList();
        taskList = f_.setup(taskList);

        taskList.onNext = function (info){
          if(info) infoGiven = true;
        };

        taskList.onFinish = function (){
          assert.equal(infoGiven, true);
          done();
        };
        taskList.start();
      });

      it('should call all methods from functionFlow', function (done){
        
        TaskList = f_.augment(TaskList, {
          functionFlow: ['getSource', 'writeSource', 'notify']
        });

        var called = function (){
          var toReturn = {};

          TaskList.prototype.f_functionFlow.forEach(function (method){
            toReturn[method] = false;
          });

          return toReturn;
        }();

        var taskList = new TaskList();
        taskList = f_.setup(taskList);

        taskList.onNext = function (info){
          var nextMethod = info.method;
          called[nextMethod] = true;
        };

        taskList.onFinish = function (){
          for(var method in called) assert.equal(called[method], true);
          done();
        };
        taskList.start();
      });


    }); // /method calling

  }); // /normal

}); // /functionFlow