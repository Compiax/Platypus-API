/**
 * @file This file implements the defined routes for use by the mobile
 * componant. As well as helper functions for these routes.
 */
var mongoose = require('mongoose');
var Bills = require('../models/bills');
var Users = require('../models/users');
var Items = require('../models/items');
var debug = require('debug')('platypus-api:controllers:mobile');
var fs = require('fs');
var multer = require('multer');
var ocr = require('./ocr');
//var io        = require('socket.io').listen(3002);
var MTypes = mongoose.Types;
var mobileHelper = require('../helpers/database');

debug('Exporting method: createSession');
/**
 * Function that receives the user data (Nickname and profile color) entered
 * when a user requests a new session. A new user is created. A new bill and
 * session are also created. The new user is then added to the bill.
 * @param {request} req req used by Express.js to fetch data from the client.
 * @param {response} res res used by Express.js to send responses back to the
 *                       client.
 * @param {object} next
 * @return JSON object containing session ID and user ID
 */
module.exports.createSession = function (req, res, next) {
  var nickname = req.body.nickname;
  var user_color = req.body.color;
  var b_id = mobileHelper.mobile.generateBillID();
  var user_added = "";
  debug("Nickname: " + nickname + ", Color: " + user_color, ", For bill ID: " + b_id);

  var bill = new Bills({
    _id: new MTypes.ObjectId(),
    bill_id: b_id,
    bill_image: "",
    users_count: 0,
    items_count: 0,
    users: [],
    bill_items: [],
    bill_total: 0,
    bill_total_claimed: 0,
    bill_owner: ""
  });

  bill.save(function (err) {
    if (err) {
      /**
       *  TODO: Create Error class for db errors
       */
      debug(err);
    }
    user_added = mobileHelper.mobile.addUserToDB(b_id, req.body.nickname, req.body.color).then(function (uid_response) {
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

debug('Exporting method: joinSession');
/**
 * This route is called to allow a new user to join an existing session. Data
 * is fetched from the client. addUserToDB() is then called to perform the
 * adding of new client data to the session.
 * @param {request} req req used by Express.js to fetch data from the client.
 *                      Used to fetch: req.body.session_id, req.body.nickname
 *                      and req.body.color from the client.
 * @param {response} res res used by Express.js to send HTTP responses back to
 *                       the client.
 * @param {object} next
 * @return HTTP status 200 using res.send().
 */
module.exports.joinSession = function (req, res, next) {
  mobileHelper.mobile.addUserToDB(req.body.session_id, req.body.nickname, req.body.color).then(function (uid_response) {
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
 * Function call to upload a file to the server. Image is saved in ./uploads.
 * Image name is added to the database.
 * @param {request} req req used by Express.js to fetch data from the client.
 *                      Used to fetch session_id from req.body.session_id and
 *                      the file name from req.body.originalname.
 * @param {response} res res used by Express.js to send responses back to the
 *                       client.
 * @param {object} next
 * @return HTTP status 200 using res.send().
 */
module.exports.sendImage = function (req, res, next) {
  debug("Image function called");
  var tmp_path = req.file.path;
  var target_path = './uploads/' + req.file.originalname;
  fs.rename(tmp_path, target_path, function (err) {
    if (err) throw err;
    fs.unlink(tmp_path, function () {
      if (err) throw err;
      // TODO: Function call to OCR module
      debug('File uploaded to: ' + target_path + ' - ' + req.file.size + ' bytes');
      ocr.detect(target_path, req.body.session_id).then((data) => {
        mobileHelper.bill.populateItems(data.data.attributes.items, req.body.session_id);
        var query = Bills.where({
          bill_id: req.body.session_id
        });
        query.update({
          $set: {
            bill_image: req.file.originalname
          }
        }).exec();

        debug('Sending response (status: 200)');
        res.status(200).send("Success");
      });
    });
  });
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
module.exports.terminateSession = function (req, res, next) {
  debug("Terminate Session called");

  var session = req.body.session_id;
  var query = Bills.find({
    bill_id: session
  });

  query.remove({
    users: {
      $size: 0
    }
  }, function (err) {
    if (err) return handleError(err);
  });
  debug('Sending response (status: 200)');
  res.status(200).send("Success");
}

module.exports.getAllSessionData = function (req, res, next) {
  var session = req.body.session_id;
  // @todo: Fix item limit
  Bills.findOne({
    bill_id: session
  }).populate({
    path: 'bill_items'
  }).exec(function (err, sess) {
    debug("sess:");
    debug(sess);
    var response = {
      data: {
        type: 'session_data',
        id: 0,
        attributes: {
          items: sess.bill_items
        }
      }
    };
    debug("SessionData");
    debug(response.data.attributes.items);
    debug('Sending response (status: 200)');
    return res.status(200).send(response);
  });
}