var debug       = require('debug')('platypus-api:controllers:ocr');

debug('Exporting method: @todo');
module.exports.detect = function(req, res, next) {
  var ocr_module = config.ocr.host;
  var ocr_port = config.ocr.port;
  var formData = {
  	file: fs.createReadStream(req.body.target_path),
	};
	request.post({url:'http://' + ocr_module + ':' + ocr_port + '/', formData: formData}, function optionalCallback(err, httpResponse, body) {
	  if (err) {
      debug(httpResponse);
	    return console.error('upload failed:', err);
	  }
	  debug(httpResponse.toJSON);
  });

  var response = {
    data: {
      type: 'bill',
	    id: 0,
	    attributes: {
	      session_id: bill.bill_id,
	    }
    }
  };

  debug('Sending response (status: 200)');
  res.status(200).send(response);
}