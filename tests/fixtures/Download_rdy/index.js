var f_ = require('./../../../index.js'),
    Download = require('./../Download'),
    Dl_proto = Download.prototype,
    function_flow = [];


for (var k in Dl_proto) {
  if (Dl_proto.hasOwnProperty(k)) {
    if (k !== 'start') {
      function_flow.push({
        name: k,
        max_tries: 10
      });
    }
  }
}

Download = f_.set.prototype(Download, {
  function_flow: function_flow
});


module.exports = Download;