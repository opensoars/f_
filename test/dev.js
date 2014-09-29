var f_ = require(__dirname + './../index.js'),
    TaskList = require('./lib/TaskList.js');


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
          console.log(called);
        };
        taskList.start();