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
    item_id       : {type: String, index: { unique: true }},
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
  }]
});

debug('Adding custom schema method: generateSessionID');
Session.methods.generateSessionID = function(){
  var alphabet = "abcdefghijklmnopqrstuvwxyz";
  var numbers = "0123456789";
  var session_id_temp = "";

  for (var i = 0; i < 5; i++) {
    var char_or_int = (Math.floor(Math.random() * 2));

    if (char_or_int === 0) {
      var alphabet_index = (Math.floor(Math.random() * 26));
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

debug('Session model exported');
module.exports = mongoose.model('Session', Session);
