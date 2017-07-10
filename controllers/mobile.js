var Session     = require('../models/session');
var debug       = require('debug')('platypus-api:controllers:mobile');

debug('Exporting method: createSession');
module.exports.createSession = function(req, res, next){
  var nickname = req.body.nickname;
  var user_color = req.body.color;

  debug('Nickname: ' + nickname + ' Color: ' + user_color);
  //@todo var session_vars = mongoMagic(nickname, user_color): return [session_id, user_id];
  var new_session = Session({
    session_id  : null,
    image_path  : "",
    bill_items  : [{
      item_id       : null,
      item_name     : null,
      item_quantity : null,
      item_price    : null
    }],
    users       : [{
      u_id          : {type: Number, index: { unique: true }},
      u_owner       : true,
      u_nickname    : nickname,
      u_color       : user_color,
      u_claimed     : [null]
    }],
  });

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
