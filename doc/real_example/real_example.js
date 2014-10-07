var fs = require('fs'),
    http = require('http'),
    https = require('https'),
    Ezlog = require('./../../node_modules/Ezlog');

var log = new Ezlog({ pref: {t: '[sourceWriter]', c: 'green' } });

var f_ = require('./../../index.js');



var URLS = ['https://www.yahoo.com'];



function SourceWriter(o){
  o = o || {}; for(var key in o) this[key] = o[key];
  return this;
}

var proto = {};


proto.start = function (){
  if(!this.url || this.url.length < 3) return this.f_abort(
    'No url, or url is to short',
    new Error('!this.url || this.url.length < 3')
  );

  log('url: ' + this.url);

  this.f_next();
};

proto.getSource = function (){
  var self = this,
      url = self.url;

  function onRes(res){
    var d = '';
    res.on('data', function (chunk){ d += chunk; });
    res.on('end', function (){
      self.d.src = d;
      self.f_next();
    });
  }

  function onError(err){
    self.f_retryThis('Could not get url: ' + url, err);
  }

  ((url.indexOf('https') !== -1) ? https : http).get(url, onRes)
    .on('error', onError);

};

proto.findSubject = function (){
  var url = this.url;

  var re = /https\:\/\/www\.(.+?)\./,
      matches = url.match(re);

  if(!matches[1]) return this.f_retryAll(
    'Could not find a subject in the given url',
    new Error('!matches[1]')
  );

  this.d.subject = matches[1];

  this.f_next();
};

proto.writeSource = function (){
  var self = this;

  fs.writeFile(self.writeDir + '')

  self.f_next();
};

proto.notify = function (){
  var self = this;

  self.f_next();
};


proto.onFinish = function (){};


proto.writeDir = './sources';


SourceWriter.prototype = proto;


SourceWriter = f_.augment(SourceWriter, {
  functionFlow: ['getSource', 'findSubject', 'writeSource', 'notify'],
  toLog: ['all'],
  desc: 'sourceWriter',

  resetOnRetryAll: true,

  maxTries: {
    wholeList: '?',
    start: '?',
    getSource: '3',
    findSubject: '?',
    writeSource: '3',
    notify: '?'
  }
});


URLS.forEach(function (url){

  var sourceWriter = f_.setup( new SourceWriter({url: url}) );

  sourceWriter.start();


});


