var f_ = require(__dirname + './../index.js');

var taskList = {

  start: function (){
    this.f_next();
  },

  getSource: function (){
    this.f_next();
  },

  writeSource: function (){
    this.f_next();
  },

  notify: function (){
    this.f_next();
  }

};

taskList = f_.augment(taskList, {
  functionFlow: ['getSource', 'writeSource', 'notify'],
  toLog: ['all'],
  desc: 'dev_object.js task list',
  maxTries: {
    wholeList: 2,
    getSource: '?',
    writeSource: '2',
    notify: '?'
  }
});

taskList = f_.setup(taskList);

taskList.start();