ezlog
=====

[![Build Status](http://img.shields.io/travis/opensoars/ezlog.svg?style=flat)](https://travis-ci.org/opensoars/ezlog)
[![Coverage Status](http://img.shields.io/coveralls/opensoars/ezlog.svg?style=flat)](https://coveralls.io/r/opensoars/ezlog)
[![Dependency Status](http://img.shields.io/gemnasium/opensoars/ezlog.svg?style=flat)](https://gemnasium.com/opensoars/ezlog)


Simple logger function that takes care of prefixes and colored output.


---

## Dependencies
* [cls](https://github.com/opensoars/cls)


## Install
`npm install ezlog` or clone source into project node_modules folder.

## Use
```js
var Ezlog = require('Ezlog');

var log = new Ezlog({
	pref: {
		t: '[main test]',
		c: 'green',
		s: ['underline', 'bold']
	},

	text: { c: 'blue', s: 'bold' }
});

```
Which should result in the following:

* [main test] hello
* [main test] world
* [main test] {"a":"b"}

Where [main test] will be colored green bold, and 'hello', 'world' and `{"a":"b"}` will be colored blue bold.

## Options
* Multiple style properties: `['bold', 'underline']`. Or just one: `'bold'`
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