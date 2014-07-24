var log = require('ezlog')({
	pref: { t: '[Dl]', c: 'yellow', s: 'bold' }, text: { c: 'white' }
});

var logGreen = require('ezlog')({
	pref: { t: '[Dl]', c: 'yellow', s: 'bold' }, text: { c: 'green', s: 'bold' }
});

var logRed = require('ezlog')({
	pref: { t: '[Dl]', c: 'yellow' }, text: { c: 'red', s: 'bold' }
});

var f_ = require('../index.js');


var Download = function (o){
	o = o || {};

	for(var key in o) this[key] = o[key];

	this.f_.errs = [];


};

Download.prototype.start = function (){
	logGreen('start');

	if(!this.url) this.pushErr('no url given');


	if(this.f_.errs.length !== 0)
		return this.f_.abort('err(s) @start, no reason to retry');

	return this.next();
};

Download.prototype.getData = function (){
	var self = this;
	setTimeout(function (){ return self.next(); }, Math.random() * 1000);
};

Download.prototype.convertFile = function (){
	var self = this;

	var r = Math.random();

	if(r > 0.5) return self.f_.abort('DEBUGGER;');

	setTimeout(function (){ return self.next(); }, Math.random() * 1000);
};

Download.prototype.clean = function (){
	var self = this;
	setTimeout(function (){ return self.next(); }, Math.random() * 1000);
};


Download.prototype.onFinish = function (){
	logGreen('finish');
};

Download.prototype.onAbort = function (){
	logRed('abort');
};


/**
 * Two required arrays for f_ to work
 */
Download.prototype.functionFlow =  [
	'getData',
	'convertFile',
	'clean'
];

Download.prototype.toReset = [ 
	{ d: {} },
	{ defaultVideoId: 'NnTg4vzli5s' }
];

/**
 * Optional shortcuts
 */
Download.prototype.next = function (){
	this.f_.next();
};

Download.prototype.pushErr = function (err){
	this.f_.errs.push(err);
};


/** Augmenting Download prototype object */
Download = f_.augment(Download);


var dl = new Download({url: 'http://www.google.com'});


dl.start();

/*
for(var i = 0; i < 100; i += 1){
    var downloadInstance = new Download({ url: 'http://someurl.com/file' + i });
    downloadInstance.start();
}
*/