var bcrypt      = require('bcryptjs');
var debug       = require('debug')('platypus-api:models:bills');
var mongoose    = require('mongoose');
var Items       = require('./items');
var Users       = require('./users');

// Typedefs for easier usage.
var ObjectId    = mongoose.Schema.Types.ObjectId;
var Schema      = mongoose.Schema;

debug('Defining schema: Bills');
var Bills = new Schema({
  bill_id     : { type: String, index: { unique: true } },
  bill_image  : String,
  users_count : Number,
  users       : [{ type: ObjectId, ref: 'Users' }],
  bill_items  : [{ type: ObjectId, ref: 'Items' }]
});

debug('Adding custom schema method: generateBillsID');
/**
 * Method to generate and store bills ID.
 */
Bills.methods.generateBillID = function() {
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

  this.model('Bills').find({ bill_id : bill_id_temp}).exec(function(err, res) {
    if (res.length || err != null) {
      debug('res = ' + res + ' and err = ' + err);
      console.log('Error: Session ID exists!');
      return false;
    }
  });
  debug('Setting bill_id_temp = ' + bill_id_temp);
  this.bill_id = bill_id_temp;
  return true;
};

debug('Adding custom schema method: addUser')
/**
 * Method to generate and store a user ID.
 */
Bills.methods.addUser = function(u_name, u_col) {
  var new_uid = (this.users_count + 1).toString();
  var own = false;
  if (new_uid.length < 2) {
    new_uid = this.bill_id + 'u0' + new_uid;
  }
  else {
    new_uid = this.bill_id + 'u' + new_uid;
  }

  if (this.users_count == 0) {
    own = true;
  }

  var user = new Users({
    u_id          : new_uid,
    u_owner       : own,
    u_nickname    : u_name,
    u_color       : u_col
  })

  this.users.push(user);
  var subdoc = this.users[this.users_count];
  subdoc.isNew;
  this.users_count = this.users_count + 1;

  this.save(function(err) {
    if (err) {
      // TODO: Create Error class for db errors
      return 0;
    }
  });
  return new_uid;
}

debug('Bills model exported');
module.exports = mongoose.model('Bills', Bills);
