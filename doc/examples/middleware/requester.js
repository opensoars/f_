var http = require('http');


http.get('http://127.0.0.1:' + process.PORT, function (res){

  console.log(res);

}).on('error', function (err){
  console.log(err);
})