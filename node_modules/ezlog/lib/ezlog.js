var cls = require('opensoars_cls');

module.exports = function (o){
	o = o || {};

	if(!o.pref) o.pref = { t: '', c: '', s: '' };
	if(!o.text) o.text = { t: '', c: '', s: '' };

	var pref = cls({ t: o.pref.t, c: o.pref.c, s: o.pref.s });

	return function (){

		for(var i=0, as = arguments; i<as.length; i+=1)
			console.log(pref, cls({ t: as[i], c: o.text.c, s: o.text.s }));

	};
};