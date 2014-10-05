var f_ = require('../index.js');


function ImgDownloader(o){
  o = o || {};

  console.log(o);
};


f_.setup(
  new f_.augment(ImgDownloader, {
    functionFlow: ['getData', 'writeData', 'notify'],
    toLog: ['start'],
    desc: 'ImgDownloaderInstance'
  })
).start();






