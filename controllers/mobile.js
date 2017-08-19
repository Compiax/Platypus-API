/**
 * @file This file implements the defined routes for use by the mobile
 * componant.
 */

var Bills     = require('../models/bills');
var Users     = require('../models/users');
var debug     = require('debug')('platypus-api:controllers:mobile');
var fs        = require('fs');
var multer    = require('multer');
var ocr       = require('./ocr');
var request   = require('request');

debug('Exporting method: createSession');
/**
 * Function that receives the user data (Nickname and profile color) entered
 * when a user requests a new session.
 * @param {request} req req used by Express.js to fetch data from the client.
 * @param {response} res res used by Express.js to send responses back to the
 *                       client.
 * @param {object} next
 * @return JSON object containing session ID and user ID
 */
module.exports.createSession = function(req, res, next){
  var nickname = req.body.nickname;
  var user_color = req.body.color;
  var b_id = generateBillID();
  var user_added = "";
  debug("Nickname: " + nickname + ", Color: " + user_color, ", For bill ID: " + b_id);
  
  var bill = new Bills({
    bill_id     : b_id,
    bill_image  : "",
    users_count : 0,
    users       : [],
    bill_items  : []
  });
  
  bill.save(function(err) {
    if (err) {
      // TODO: Create Error class for db errors
      debug(err);
    }
    user_added = addUserToDB(b_id, req.body.nickname, req.body.color).then(function (uid_response) {
      var response = {
        data: {
          type: 'bill',
          id: 0,
          attributes: {
            session_id: bill.bill_id,
            user_id: uid_response
          }
        }
      };
      
      debug("Session ID: " + response.data.attributes.session_id + ", User ID: " + response.data.attributes.user_id);
      debug('Sending response (status: 200)');
      return res.status(200).send(response);
    });
  });
}

module.exports.joinSession = function(req, res, next){
  addUserToDB(req.body.session_id, req.body.nickname, req.body.color).then(function (uid_response) {
    var response = {
      data: {
        type: 'bill',
        id: 0,
        attributes: {
          user_id: uid_response
        }
      }
    };
    debug('Sending response (status: 200)');
    return res.status(200).send(response);
  });
}

debug("Exporting method sendImage");
/**
 * Function call to upload a file to the server. Image is saved in ./uploads
 * Image name is added to the database.
 * @param {request} req req used by Express.js to fetch data from the client.
 *                      Used to fetch session_id from req.body.session_id and
 *                      the file name from req.body.originalname.
 * @param {response} res res used by Express.js to send responses back to the
 *                       client.
 * @param {object} next
 * @return HTTP status 200 using res.send().
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
  var query = Bills.find({bill_id: session});

  query.remove({users: {$size: 0}}, function(err) {
    if (err) return handleError(err);
  });
}

debug('Adding custom schema method: generateBillsID');
/**
 * Method to generate and store bills ID.
 */
function generateBillID() {
  var alphabet = 'abcdefghjklmnopqrstvwxyz';
  var numbers = '0123456789';
  var bill_id_temp = "";

  for (var i = 0; i < 5; i++) {
    var char_or_int = (Math.floor(Math.random() * 2));

    if (char_or_int === 0) {
      var alphabet_index = (Math.floor(Math.random() * 24));
      bill_id_temp = bill_id_temp + alphabet.charAt(alphabet_index);
    }
    else {
      var numbers_index = (Math.floor(Math.random() * 10));
      bill_id_temp = bill_id_temp + numbers.charAt(numbers_index);
    }
  }

  Bills.find({ bill_id : bill_id_temp}).exec(function(err, res) {
    if (res.length || err != null) {
      console.log('Error: Session ID exists!');
      return false;
    }
  });
  return bill_id_temp;
};

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

function addUserToDB(session_id, nname, ucolor) {
  return new Promise(function (resolve, reject) {
    var finalid = null;
    Bills.findOne({bill_id: session_id}, function(err, doc){
      if (err) {
        console.log("Bill not found!");
        // TODO: Fix error handling
        return 0;
      }
      var bill_session = doc;
      var user_count = bill_session.users_count;
      var nickname = nname;
      var user_color = ucolor;
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
        if (err) return handleError(err);
        console.log('Success!');
      });
      debug("Added obj: " + bill_session.users[user_count-1]);
      resolve(user_id);
    });
  });
}
