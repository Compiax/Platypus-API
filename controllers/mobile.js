var Bills     = require('../models/bills');
var debug     = require('debug')('platypus-api:controllers:mobile');
var fs        = require('fs');
var multer    = require('multer');

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
      debug(err);
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

debug("Exporting method: joinSession");
/**
  * Function that allows new users to join an existing session that has already
  * been created.
  * @return {Object}
  */
module.exports.joinSession = function(req, res, next) {
  debug("joinSession called");
  var nickname = req.body.nickname;
  var user_color = req.body.color;
  debug("Nickname: " + nickname + " And color: " + user_color);

  var session_id = req.body.session_id;
  debug("Session ID: " + session_id);

  debug("Searching DB for bill with session_id");
  //var query = Bills.where({bill_id: session_id});
  var bill = Bills.findOne({bill_id: session_id});
  console.log(bill);

  // TODO: refine error checking that valid bill is found
  var uid = 0;
  // if (bill != null) {
  //   debug("Adding new user to existing bill");
  //   uid = bill.addUser(nickname, user_color);
  // }

  debug("Respond with user_id");
  var response = {"user_id": uid};
  debug('Sending response (status: 200)');
  res.status(200).send(response);
}

debug("Exporting method sendImage");
/**
 * Function call to upload a file to the server. Image is saved in ./uploads
 * Image name is added to the database.
 * Session ID is contained in req.body.session_id
 * File name is contained in req.file.originalname
 */
module.exports.sendImage = function(req, res, next){
  debug("Image function called");

  var tmp_path = req.file.path;
  var target_path = './uploads/' + req.file.originalname;
  fs.rename(tmp_path, target_path, function(err) {
      if (err) throw err;
      fs.unlink(tmp_path, function() {
          if (err) throw err;
          // TODO: Function call to OCR module
          debug('File uploaded to: ' + target_path + ' - ' + req.file.size + ' bytes');
      });
  });

  var query = Bills.where({bill_id: req.body.session_id});
  query.update({$set: {bill_image : req.file.originalname}}).exec();

  debug('Sending response (status: 200)');
  res.status(200).send("Success");
}
