/**
 * Let's put everything in the f_ Class prop
 * Let's create a retryThis function
 */

var cls = require('opensoars_cls');

var log = require('ezlog')({
	pref: { t: '[f_]', c: 'yellow' }, text: { c: 'white' }
});

var logRed = require('ezlog')({
	pref: { t: '[f_]', c: 'yellow' }, text: { c: 'red' }
});

var logGreen = require('ezlog')({
	pref: { t: '[f_]', c: 'yellow' }, text: { c: 'green' }
});



var f_properties = {
	i: 0,
	tries: 1,
	maxTries: 5
};

var f_functions = {

	next: function (){
		var f_ = this,
				par = f_.par,
				functionFlow = par.functionFlow;

		if(f_.i === 0) logGreen('starting task');

		if(f_.i === functionFlow.length)
			return f_.finish();

		var fn = functionFlow[f_.i];
		par.currentFn = fn;

		if(par[fn] && typeof par[fn] === 'function'){
			f_.i = f_.i + 1;

			log('next: ' + fn);

			par[fn]();
		}
		else return f_.abort('no next function for flow');

	},

	abort: function (cuz){
		var f_ = this,
				par = f_.par;

		cuz = cuz || '';

		logRed('Abort, cuz: ' + cuz);

		logRed('this.errs[]  stack below');
		for(var i=0; i<this.errs.length; i+=1)
			log('  ' + this.errs[i]);

		if(par.onAbort) par.onAbort(cuz);
	},

	finish: function (){
		var f_ = this,
				par = f_.par;

		logGreen('task complete');
		if(par.onFinish) par.onFinish();
	}

};


function augment(par){

	if(!par) throw 'need parent object class';

	if(typeof par !== 'function') throw 'typeof parent ! func';

	if(!par.prototype.functionFlow) throw '!par.functionFlow';
	if(!par.prototype.toReset) par.prototype.toReset = [];


	if(par.f_) throw 'not going to overwrite par.f_';
	par.prototype.f_ = {
		par: par.prototype
	};

	for(var propName in f_properties)
		par.prototype.f_[propName] = f_properties[propName];

	for(var funcName in f_functions)
		par.prototype.f_[funcName] = f_functions[funcName];


	return par;
}

module.exports = {
	augment: augment
};
