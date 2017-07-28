/**
 * @file This file implements the defined routes for use by the OCR componant
 */

var debug       = require('debug')('platypus-api:controllers:ocr');

/**
 * @TODO Once this method is correctly implemented complete documentation.
 * @param {request} req req used by Express.js to fetch data from the client.
 * @param {response} res res used by Express.js to send responses back to the
 *                       client.
 * @param {object} next
 * @return JSON object containing Bill information
 */
debug('Exporting method: @todo');
module.exports.todo = function(req, res, next){
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
