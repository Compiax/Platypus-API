var Session     = require('../models/session');
var debug       = require('debug')('platypus-api:controllers:mobile');

debug('Exporting method: createSession');
/**
 * Function that receives the user data (Nickname and profile color) entered
 * when a user requests a new session.
 * @return {Object}        JSON object containing session ID and user ID
 */
module.exports.createSession = function(req, res, next){
  var nickname = req.body.nickname;
  var user_color = req.body.color;
  var new_session = Session({
    session_id  : "",
    image_path  : "",
    bill_items  : [{
      item_id       : "",
      item_name     : "",
      item_quantity : 0,
      item_price    : 0
    }],
    users       : [{
      u_id          : "",
      u_owner       : true,
      u_nickname    : nickname,
      u_color       : user_color,
      u_claimed     : [{item: 0, quantity: 0}]
    }],
    users_count : 0
  });

  new_session.generateSessionID();
  new_session.addUser();
  new_session.isNew = true;

  debug('Saving Session');
  new_session.save(function (err, new_session) {
    if (err) {
      return console.error("Session not saved!");
    }
  });

  var response = {
    data: {
      type: 'session',
	    id: 0,
	    attributes: {
	      session_id: new_session.session_id,
        user_id: new_session.users[0].u_id
	    }
    }
  };

  debug('Sending response (status: 200)');
  res.status(200).send(response);
}
