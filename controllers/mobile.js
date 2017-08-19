var Bills     = require('../models/bills');
var Users     = require('../models/users');
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

module.exports.joinSession = function(req, res, next){
  debug('Sess = ' + req.body.session_id);
  Bills.findOne({bill_id: req.body.session_id}, function(err, doc){
    debug("Finding doc");
    if (err) {
      console.log("Bill not found!");
      // TODO: Fix error handling
      return 0;
    }
    var bill_session = doc;
    var user_count = bill_session.users_count;
    var nickname = req.body.nickname;
    var user_color = req.body.color;
    var user_id = getUserId(user_count);
    var user_owner = (user_count == 0);
  
    debug(user_count);
  
    debug("Adding user: uid = " + user_id + ", uOwner = " + user_owner + ", uNickname = " + nickname + ", uColor = " + user_color);
  
    var user = new Users({
      u_id          : user_id,
      u_owner       : Boolean,
      u_nickname    : nickname,
      u_color       : user_color
    });
  
    bill_session.users.push(user);
    var subdoc = bill_session.users[user_count];
    subdoc.isNew;
    bill_session.users_count = user_count+1;
  
    bill_session.save(function (err) {
      if (err) return handleError(err)
      console.log('Success!');
    });
    debug("Added obj: " + bill_session.users[user_count-1]);
    var response = {
      data: {
        type: 'user_id',
        id: 0,
        attributes: {
          u_id: user_id,
        }
      }
    };
  
    debug('Sending response (status: 200)');
    res.status(200).send(response);
  });
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
          ocr.detect(target_path);
      });
  });

  var query = Bills.where({bill_id: req.body.session_id});
  query.update({$set: {bill_image : req.file.originalname}}).exec();

  debug('Sending response (status: 200)');
  res.status(200).send("Success");
}
  
/**
 * This module will terminate the existing session when called.
 * @param {request} req req used by Express.js to fetch data from the client.
 *                      Session is fetched from req.body.session_id.
 * @param {response} res res used by Express.js to send responses back to the
 *                       client.
 * @param {object} next
 * @returns HTTP status 200 using res.send().
 */
module.exports.terminateSession = function(req, res, next){
  debug("Terminate Session called");

  var session = req.body.session_id;
  var found = false;
  /**
   * TODO: Searh through DB for the correct session]
   */

  debug("Ensuring correct session is found");
  if (found) {
    /**
     * TODO: Remove session from DB
     */

    debug("Session found, removing: Response (status: 200)");
    res.status(200).send("Success, session removed");
  }
  /**
   * TODO: Replace with more appropriate error management
   */
  else {
    debug("Session not found, doing nothing: Response (Status: 200)");
    res.status(200).send("Session not found, doing nothing");
  }
}

function getUserId(num) {
  var new_uid = (num + 1).toString();

  if (new_uid.length < 2) {
    new_uid = 'u0' + new_uid;
  }
  else {
    new_uid = 'u' + new_uid;
  }
  return new_uid;
}
