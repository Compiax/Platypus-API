var Bills     = require('../models/bills');
var debug     = require('debug')('platypus-api:controllers:mobile');
var multer    = require('multer');
var upload    = multer({ dest: '../uploads/' });

// upload.single('avatar'), function (req, res, next) {
//   // req.file is the `avatar` file
//   // req.body will hold the text fields, if there were any
// })

debug('Exporting method: createSession');
/**
 * Function that receives the user data (Nickname and profile color) entered
 * when a user requests a new session.
 * @return {Object}        JSON object containing session ID and user ID
 */
module.exports.createSession = function(req, res, next){
  var nickname = req.body.nickname;
  var user_color = req.body.color;
  debug("Nickname: " + nickname + " And color: " + user_color);

  var bill = new Bills({
    bill_id     : "",
    bill_image  : "",
    users_count : 0,
    users       : [],
    bill_items  : []
  });

  while (!bill.generateBillID()) {

  }

  bill.save(function(err) {
    if (err) {
      // TODO: Create Error class for db errors
      return 0;
    }
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

debug("Exporting method sendImage");
module.exports.sendImage = function(req, res, next){
  debug("Image function called");
  debug("req: " + req);
  console.log(req);
  var s_img = req.body.image;
  var s_id = req.body.session_id;
  debug("Image: " + s_img);
  debug("Session ID: " + s_id);

  debug('Sending response (status: 200)');
  res.status(200).send("Success");
}
