var Ezlog = require(__dirname + '/../lib/ezlog.js');

var log1 = new Ezlog({

	pref: {
		t: '[main test]',
		c: 'green',
		s: ['underline', 'bold']
	},

	text: {
		c: 'blue',
		s: 'bold'
	}

});

log1('hello', 'world');

log1({
	a: 'b'
});


var log2 = new Ezlog();

log2('By default it looks like this!');


var log3 = new Ezlog([]);

log3('When wrong options are given, we get a default logger (array)');


var log3 = new Ezlog('HELLO');

log3('When wrong options are given, we get a default logger (string)');



