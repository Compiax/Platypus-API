var debug       = require('debug')('platypus-api:controllers:tests');

debug('Exporting method: browse');
module.exports.testFunction = function(req, res, next){
  debug('Trying to find users');

	return next(new Error('This is just a test'));

  var response = {
    data: {
	    type: 'test',
	    id: 0,
	    attributes: {
	      someField: 'someValue'
	    }
	  }
  };

  debug('Sending response (status: 200)');
  res.status(200).send(response);
};
