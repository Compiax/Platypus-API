var Session     = require('../models/session');
var debug       = require('debug')('platypus-api:controllers:mobile');

debug('Exporting method: createSession');
module.exports.createSession = function(req, res, next){
  var nickname = req.body.nickname;
  var user_color = req.body.color;

  debug('Nickname: ' + nickname + ' Color: ' + user_color);
  //@todo var session_vars = mongoMagic(nickname, user_color): return [session_id, user_id];
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
    }]
  });


  new_session.generateSessionID();
  new_session.users[0].u_id = new_session.session_id + "u00";
  new_session.bill_items[0].item_id = new_session.session_id + "i00";
  debug('sessionID generated = ' + new_session.session_id);
  new_session.save(function (err, new_session) {
    if (err) return console.error("Session not saved!");
  });

  debug('Session created: ' + new_session);
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
}
