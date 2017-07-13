var debug       = require('debug')('platypus-api:controllers:ocr');
var spawn       = require('child_process').spawn;

debug('Exporting method: detectText');
module.exports.detectText = function(req, res, next){
  debug("req: " + req);
  console.log("req: " + req);

  var response = {
    data: {
      type: 'session',
	    id: 0,
	    attributes: {
	      session_id: '@todo',
        user_id: '@todo'
	    }
    }
  };

  res.status(200).send(response);
}
