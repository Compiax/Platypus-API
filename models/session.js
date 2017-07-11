var bcrypt      = require('bcryptjs');
var debug       = require('debug')('platypus-api:models:session');
var mongoose    = require('mongoose');

// Typedefs for easier usage.
var ObjectId    = mongoose.Schema.Types.ObjectId;
var Schema      = mongoose.Schema;

debug('Defining schema: Session');
var Session = new Schema({
  session_id  : {type: String, index: { unique: true }},
  image_path  : String,
  bill_items  : [{
    item_id       : String,
    item_name     : String,
    item_quantity : Number,
    item_price    : Number
  }],
  users       : [{
    u_id          : {type: String, index: { unique: true }},
    u_owner       : Boolean,
    u_nickname    : String,
    u_color       : String,
    u_claimed     : [{item: Number, quantity: Number}]
  }],
  users_count : Number
});

debug('Adding custom schema method: generateSessionID');
/**
 * Method to generate and store session ID.
 */
Session.methods.generateSessionID = function() {
  var alphabet = "abcdefghjklmnopqrstvwxyz";
  var numbers = "0123456789";
  var session_id_temp = "";

  for (var i = 0; i < 5; i++) {
    var char_or_int = (Math.floor(Math.random() * 2));

    if (char_or_int === 0) {
      var alphabet_index = (Math.floor(Math.random() * 24));
      session_id_temp = session_id_temp + alphabet.charAt(alphabet_index);
    }
    else {
      var numbers_index = (Math.floor(Math.random() * 10));
      session_id_temp = session_id_temp + numbers.charAt(numbers_index);
    }
  }

  debug('Setting session_id_temp = ' + session_id_temp);
  this.session_id = session_id_temp;
};

debug('Adding custom schema method: addUser')
/**
 * Method to generate and store a user ID.
 */
Session.methods.addUser = function() {
  var new_uid = (this.users_count + 1).toString();
  if (new_uid.length < 2) {
    new_uid = this.session_id + "u0" + new_uid;
  }
  else {
    new_uid = this.session_id + "u" + new_uid;
  }
  this.users[this.users_count].u_id = new_uid;
  this.users_count = this.users_count + 1;
}

debug('Session model exported');
module.exports = mongoose.model('Session', Session);
