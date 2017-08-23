/**
 * @file This file implements the defined routes for use by the OCR componant
 */
var config      = require('config');
var debug       = require('debug')('platypus-api:controllers:ocr');
var fs          = require('fs');
var request     = require('request');

/**
 * @TODO Once this method is correctly implemented complete documentation.
 * @param {request} req req used by Express.js to fetch data from the client.
 * @param {response} res res used by Express.js to send responses back to the
 *                       client.
 * @param {object} next
 * @return JSON object containing Bill information
 */
debug('Exporting method: @todo');
module.exports.detect = function(target_path, bill) {
  var ocr_module = config.servers.ocr.host;
  var ocr_port = config.servers.ocr.port;
  var formData = {
  	file: fs.createReadStream(target_path),
	};
	request.post({url:'http://192.168.43.144' + /*+ ocr_module +*/ ':' + ocr_port + '/', formData: formData, json: true}, function optionalCallback(err, httpResponse, body) {
	  if (err) {
      debug(httpResponse);
	    return console.error('upload failed:', err);
    }
    debug("HTTPResponse: ");
    debug(httpResponse);
    debug("Body: ");
    debug(body.attributes.data);
  });

  var response = {
    data: {
      type: 'ocr',
	    id: 0,
	    attributes: {
	      session_id: bill,
	    }
    }
  };

  debug('Sending response (status: 200)');
  return response;
}