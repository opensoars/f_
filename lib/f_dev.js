var f_methods = {

	init: function init(){
		console.log(this);
	},

	next: function next(){

	},

	retryAll: function retryAll(){

	},

	retry: function retry(){

	},

	retryFrom: function retryFrom(){

	},

	retryThis: function retryThis(){

	},

	abort: function abort(){

	},

	finish: function finish(){

	}

};

function augment(toAugment, config){
	toAugment = toAugment || undefined;

	if(!toAugment)
		throw '!toAugment Class|Object given';

	if(typeof toAugment !== 'function')
		throw 'wrong toAugment type, !function';

	if(!config)
		throw '!config  f_ needs config object';

	if(typeof config !== 'object')
		throw 'wrong config type, !object';

	if(!config.functionFlow)
		throw '!config.functionFlow, f_ needs to know which methods to call';

	if(!config.functionFlow.length)
		throw 'wrong config.functionFlow type, !array OR no method names given';


	var f_props = {
		errorArray: config.errorArray || 'errs',
		resetOnRetry: config.resetOnRetry || true,
		dataNamespace: config.dataNamespace || 'd',
		maxTotalRetries: config.maxTotalRetries || 10,
		maxMethodRetries: config.maxMethodRetries || 10,
		maxMethodRetriesByName: config.maxMethodRetriesByName || {},
		toLog: config.toLog || ['all']
	};

	for(var methodName in f_methods)
		toAugment.prototype['f_' + methodName] = f_methods[methodName];
	
	for(var propName in f_props)
		toAugment.prototype['f_' + propName] = f_props[propName];
	

	return toAugment;
}

function setup(toSetup){

	toSetup[toSetup.f_errorArray] = [];


	return toSetup;
}

module.exports = {
	augment: augment,
	setup: setup
};