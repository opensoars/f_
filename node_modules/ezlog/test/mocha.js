

var assert = require('assert');

var Ezlog = require(__dirname + '/../lib/ezlog.js');

describe('Ezlog', function (){

	describe('#colored output', function (){

		it('should log a green prefix and a red text', function (){

			var logRed = new Ezlog({
				pref: {c: 'green', t: '[green prefix]'},
				text: {c: 'red'}
			});

			logRed('Hello world, red text!');
		});

	});

	describe('#types', function (){

		it('Ezlog Class should be of type function', function (){
			assert.equal('function', typeof Ezlog);
		});

		it('Ezlog instance should be of type function', function(){
			assert.equal('function', typeof new Ezlog());
		});

	});

	describe('#default', function (){

		it('Ezlog should return a default logger, when no options are given', function (){
			assert.equal('function', typeof new Ezlog());
		});

		it('Ezlog should return a default logger, when WRONG options are given', function (){
			assert.equal('function', typeof new Ezlog([]) );
			assert.equal('function', typeof new Ezlog('') );
		});

	});


});

/*
var assert = require("assert")
describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    })
  })
})
*/