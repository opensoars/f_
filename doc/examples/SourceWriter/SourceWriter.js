var fs = require('fs'),
    http = require('http'),
    https = require('https'),
    Ezlog = require('./../node_modules/Ezlog');

var log = new Ezlog({ pref: {t: '[sourceWriter]', c: 'green' } });

var f_ = require('./../node_modules/f_');

var SOURCES = [
  { url: 'https://github.com/opensoars', title: 'github'},
  { url: 'https://developer.mozilla.org/en-US/', title: 'developer.mozilla'},
  { url: 'https://www.bing.com', title: 'bing'},
  { url: 'https://www.yahoo.com', title: 'yahoo'},
  { url: 'https://www.google.nl', title: 'google'},
  { url: 'https://www.youtube.com', title: 'youtube'},
  { url: 'http://spele.nl/', title: 'spele'}
];


/** SourceWriter Class constructor function
 * @arg     o    {object}  Options object
 * @returns self {Class}   Make chains possible
 */
function SourceWriter(o){
  o = o || {}; for(var key in o) this[key] = o[key];
  return this;
}


// Empty object which will hold our f_ functionality untill
// we assign it to the SourceWriter.prototype
var proto = {};


/** SourceWriter.start
 * Starts up our f_ task list
 * IF no or wrong url, f_abort
 * Log if url is OK
 */
proto.start = function (){
  if(!this.url || this.url.length < 3) return this.f_abort(
    'No url, or url is to short',
    new Error('!this.url || this.url.length < 3')
  );

  log('Starting with url: ' + this.url);

  return this.f_next();
};

/** SourceWriter.getSource
 * Gets a source code from given url
 * IF request fails, f_retryThis
 * @d.src {string}  Source code
 */
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

/** SourceWriter.writeSource
 * Writes source code to HD
 * IF it could not write, f_retryThis
 * @d.fn {string}  Filename of the file to be written
 */
proto.writeSource = function (){
  var self = this,
      writeDir = self.writeDir,
      title = self.title,
      src = self.d.src;

  var fn = writeDir + '/' + title + '_' + new Date().getTime() + '.html';

  self.d.fn = fn;

  function cb(err){
    if(err)
      return self.f_retryThis('Could not write file to: ' + writeDir, err);
    

    return self.f_next();
  }

  fs.writeFile(fn, src, cb);
};

/** SourceWriter.notify
 * Does some pretty logging about results
 */
proto.notify = function (){

  log('Succes!');
  log('Subject: ' + this.d.title);
  log('Location: ' + this.d.fn);
  log('Content length: ' + this.d.src.length);

  this.f_next();
};


// writeDir has to be the same with every instance, so we just assign
// it to the proto
proto.writeDir = __dirname + '/sources';


// Let's give our SourceWriter a complete prototype from proto
SourceWriter.prototype = proto;


// f_.augment our SourceWriter. Will make the Class ready for initialization
SourceWriter = f_.augment(SourceWriter, {
  functionFlow: ['getSource', 'writeSource', 'notify'],
  toLog: ['all'],
  desc: 'sourceWriter',
  resetOnRetryAll: true,
  maxTries: {
    getSource: 3, writeSource: 3, notify: '?'
  }
});


// for each url, spawn a SourceWriter instance and pass the url
var c = 0;
SOURCES.forEach(function (source){

  var sourceWriter = f_.setup(
    new SourceWriter({ url: source.url, title: source.title })
  );

  sourceWriter.f_desc =  sourceWriter.f_desc + ' ' + c;
  sourceWriter.start();

  c += 1;
});


