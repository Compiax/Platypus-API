/**
 * @file This file implements the defined routes for use by the OCR componant
 */

var debug       = require('debug')('platypus-api:controllers:ocr');

/**
 * @todo Once this method is correctly implemented complete documentation.
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
