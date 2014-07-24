ezlog
=====

Simple logger function that takes care of prefixes and colored output.

## Install
`npm install ezlogger` or clone source into project node_modules folder.

## Use
```js
var log = require('../lib/ezlog.js')({
	
	pref: {
		t: '[test]',
		c: 'green',
		s: 'bold'
	},

	text: {
		c: 'blue',
		s: 'bold'
	}

});

log('It', 'works');

```
Which should result in the following:

* [test] It
* [test] works

Where [test] will be colored green bold, and 'It' and 'works' will be colored blue bold.

## Options
* Multiple style properties: ['bold', 'underline']. Or just one: 'bold'
* Prefixes if needed.
* 9 Colors
	* white
	* grey
	* black
	* blue
	* cyan
	* green
	* magenta
	* red
	* yellow
* 5 Styles (if supported by your os/terminal)
	* bold
	* italic
	* underline
	* inverse
	* strikethrough