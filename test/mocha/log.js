var assert = require('assert');

var f_ = require(__dirname + './../../index.js'),
    TaskList = require('./../lib/TaskList.js');

/**
 * FIX THIS ONE
 */
describe('f_ logging', function (){

  describe('#logNoDesc', function (){

    it('should log about start ^ ^ ^  (but no blue desc)', function (){
      f_.setup( new (f_.augment(TaskList, {
        functionFlow: ['getSource', 'writeSource', 'notify'],
        toLog: ['start']
      })) ).start();
    });

  });

});

