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

debug('Bills model exported');
module.exports = mongoose.model('Bills', Bills);
