var assert = require('assert');

var f_ = require(__dirname + './../../index.js'),
    TaskList = require('./../lib/TaskList.js');



describe('addErr', function (){

  describe('#normal errors', function (){

    it('should add a description / `desc`', function (done){
      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify']
      });

      var taskList = new TaskList();
      taskList = f_.setup(taskList);

      taskList.f_addErr('error description');

      assert.equal(taskList.f_errs[0].desc, 'error description')
      done();
    });

    it('should add an error object / `err`', function (done){
      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify']
      });

      var taskList = new TaskList();
      taskList = f_.setup(taskList);

      taskList.f_addErr(undefined, new Error('error'));

      assert.equal(taskList.f_errs[0].err.message, 'error');
      done();
    });

  });

  describe('#empty errors', function (){

    it('should not fail when no arguments are given', function (done){
      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify']
      });

      var taskList = new TaskList();
      taskList = f_.setup(taskList);

      taskList.f_addErr();
      done();
    });

    it('should add an empty string to desc when no desc argument is given', function (done){
      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify']
      });

      var taskList = new TaskList();
      taskList = f_.setup(taskList);

      taskList.f_addErr();
      assert.equal(taskList.f_errs[0].desc, '');
      done();
    });


    it('should add an empty object to err when no err argument is given', function (done){
      TaskList = f_.augment(TaskList, {
        function_flow: ['getSource', 'writeSource', 'notify']
      });

      var taskList = new TaskList();
      taskList = f_.setup(taskList);

      taskList.f_addErr();
      assert.equal(taskList.f_errs[0].err.message, undefined);
      done();
    });


  });



});