var cls = require('opensoars_cls');


/**
 * Top level class to draw insances from
 * @o.p {object}   How to log prefix
 * @o.t {object}   How to log text
 * @return {function} Logger function closure over params
 */
function Ezlog(o){
	o = o || {};

	if(typeof o === 'string') o = {};
	if(o instanceof Array) o = {};

	if(!o.p) o.p = { t: '', c: '', s: '' };
	if(!o.t) o.t = { t: '', c: '', s: '' };

	var pref = cls(o.p.t, o.p.c, o.p.s);

	return function ezlog(){
		for(var i=0, as=arguments; i<as.length; i+=1)
			console.log( pref, cls(as[i], o.t.c, o.t.s) );
	};

}

module.exports = Ezlog;