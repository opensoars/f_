var fs = require('fs'),
    http = require('http'),
    https = require('https'),
    Ezlog = require('./../../node_modules/Ezlog');

var log = new Ezlog({ pref: {t: '[sourceWriter]', c: 'green' } });

var f_ = require('./../../index.js');



var URLS = [
  'https://github.com/opensoars',
  'https://developer.mozilla.org/en-US/',
  'https://www.bing.com',
  'https://www.yahoo.com',
  'https://www.google.nl',
  'https://www.youtube.com',
  'http://spele.nl/'
];



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

  log('Starting with url: ' + this.url);

  return this.f_next();
};

proto.getSource = function (){
  var self = this,
      url = self.url;



  function onRes(res){
    var d = '';
    res.on('data', function (chunk){ d += chunk; });
    res.on('end', function (){
      self.d.src = d;

      return self.f_next();
    });
  }

  function onError(err){
    self.f_resetNamespace();
    return self.f_retryThis('Could not get url: ' + url, err);
  }

  ((url.indexOf('https') !== -1) ? https : http).get(url, onRes)
    .on('error', onError);

};

proto.findSubject = function (){
  var url = this.url;

  var re = /https*\:\/\/w*\.*(.+?)\./,
      matches = url.match(re);

  if(!matches) return this.f_retryAll(
    'Could not find a subject in the given url: ' + url,
    new Error('!matches[1]')
  );

  this.d.subject = matches[1];

  return this.f_next();
};

proto.writeSource = function (){
  var self = this,
      writeDir = self.writeDir,
      subject = self.d.subject,
      src = self.d.src;

  var fn = writeDir + '/' + subject + '_' + new Date().getTime() + '.html';

  self.d.fn = fn;

  function cb(err){
    if(err){
      self.f_resetNamespace();
      return self.f_retryThis('Could not write file to: ' + writeDir, err);
    }

    return self.f_next();
  }

  fs.writeFile(fn, src, cb);
};

proto.notify = function (){

  log('Succes!');
  log('Subject: ' + this.d.subject);
  log('Location: ' + this.d.fn);
  log('Content length: ' + this.d.src.length);

  this.f_next();
};


proto.writeDir = __dirname + '/sources';


SourceWriter.prototype = proto;


SourceWriter = f_.augment(SourceWriter, {
  functionFlow: ['getSource', 'findSubject', 'writeSource', 'notify'],
  toLog: ['all'],
  desc: 'sourceWriter',
  resetOnRetryAll: true,
  maxTries: {
    getSource: 3, findSubject: '?', writeSource: 3, notify: '?'
  }
});


var c = 0;
URLS.forEach(function (url){

  var sourceWriter = f_.setup( new SourceWriter({url: url}) );
  sourceWriter.f_desc =  sourceWriter.f_desc + ' ' + c;
  sourceWriter.start();

  c += 1;
});


