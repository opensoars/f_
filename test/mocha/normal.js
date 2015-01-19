var assert = require('assert');

var f_ = require(__dirname + './../../index.js'),
    TaskList = require('./../lib/TaskList.js');

describe('normal run', function (){

  describe('#f_status', function (){

    it('should be `finished`', function (done){

      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify']
      });

      var taskList = f_.setup( new TaskList() );

      taskList.onFinish = function (){
        assert.equal(this.f_status, 'finished');
        done();
      };

      taskList.start();
    });

  });

  describe('#onFinish', function (){

    it('f_ should call `onFinish`', function (done){

      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify']
      });

      var taskList = f_.setup( new TaskList() );

      taskList.onFinish = done

      taskList.start();
    });

  });

  describe('#async', function (){
    it('should be able to finish when we run async methods', function (done){

      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify']
      });

      var taskList = f_.setup( new TaskList({
         randomTimeout: true
      }) );

      taskList.onFinish = done

      taskList.start();

    });
  });

});