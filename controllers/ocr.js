var debug       = require('debug')('platypus-api:controllers:ocr');
var spawn       = require('child_process').spawn;

debug('Exporting method: detectText');
module.exports.detectText = function(req, res, next){
  debug("req: " + req);
  console.log(req);

  debug("Spawning python thing.");
  py = spawn('python',['ocr.py', req]);
  var recognisedText = "";
  py.stdout.on('data',function(filenames) {
  	recognisedText += filenames.toString();
  });

  return py.stdout.on('end',function() {
  	console.log('Characters recognised: ',recognisedText);
    return recognisedText;
  });
  //res.status(200).send(response);
}
