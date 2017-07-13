var debug       = require('debug')('platypus-api:controllers:tests');
var errors        = require('../helpers/errors');

var AuthenticatedError  = errors.auth.AuthenticatedError;

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
}

debug('Exporting method: createSession');
module.exports.createSession = function(req, res, next){
  var nickname = req.body.nickname;
  var user_color = req.body.color;

  debug('Nickname: ' + nickname + ' Color: ' + user_color);
  //@todo var session_vars = mongoMagic(nickname, user_color): return [session_id, user_id];


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
  debug('Sending response (status: 200)');
  res.status(200).send(response);
  //return response;
}

debug('Exporting method: sessionError');
module.exports.sessionError = function(req, res, next){
    console.log("error Session");

    if (!madeASession) {
      return next(new AuthenticatedError());
    }
    else {
      return next();
    }

  //res.status(200).send(response);
  // var response = {
  //   data: {
  //     type: 'session',
	//     id: 0,
	//     attributes: {
	//       session_id: session_vars['session_id'],
  //       user_id: session_vars['user_id']
	//     }
  //   }
  // }
}
