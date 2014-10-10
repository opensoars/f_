var Ezlog = require('./../../../node_modules/Ezlog');

var log = new Ezlog({ p: {t: '[requester]', c: 'blue', s: 'bold' } }),
    logRed = new Ezlog({ p: {t: '[requester]', c: 'red' } });


var http = require('http');


http.get('http://127.0.0.1:' + process.PORT, function (res){
  var d = ''; res.on('data', function (c){ d += c; });

  res.on('end', function (){
    log('res.on(end) data below', d);
  });

}).on('error', function (err){
  logRed('Could not make request, err below', err);
});