var log = require('../lib/ezlog.js')({

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

log('It', 'works');