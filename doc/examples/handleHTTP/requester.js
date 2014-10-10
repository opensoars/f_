// Simple HTTP requester to test handleHTTP.js

var http = require('http'),
    qs = require('querystring');


var Ezlog = require('./../../../node_modules/Ezlog');

var log = new Ezlog({ p: {t: '[requester]', c: 'blue', s: 'bold' } }),
    logRed = new Ezlog({ p: {t: '[requester]', c: 'red' } });



var randomQs = {

  keys: function (){ return 'abcdefghijklmnopqrstuvwxyz'.split(''); }(),
  vals: function (){ return '1234567890'.split(''); }(),

  create: function (){
    var k = this.keys, v = this.vals,
        json = {};

    for(var i = 0; i<(Math.round(Math.random() * 10) + 1); i+=1)
      json[ k[ Math.round(Math.random() * (k.length - 1)) ] ]
        = ( v[ Math.round(Math.random() * (v.length -1)) ] * 50 );
    
    return qs.stringify(json);
  }
};



(function makeGet(){

  var url = 'http://127.0.0.1:' + process.PORT + '?' + randomQs.create()

  http.get(url, function (res){
    var d = ''; res.on('data', function (c){ d += c; });

    res.on('end', function (){
      log('res.on(end) data below', d);
    });

  }).on('error', function (err){
    logRed('Could not make request, err below', err);
  });

  setTimeout(makeGet, 5000);
}());


