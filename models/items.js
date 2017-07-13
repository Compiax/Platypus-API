var bcrypt      = require('bcryptjs');
var debug       = require('debug')('platypus-api:models:items');
var mongoose    = require('mongoose');

// Typedefs for easier usage.
var ObjectId    = mongoose.Schema.Types.ObjectId;
var Schema      = mongoose.Schema;

debug('Defining schema: Session');
var Items = new Schema({
  item_id       : String,
  item_name     : String,
  item_quantity : Number,
  item_price    : Number,
  claimed_by    : [String]
});

debug('Items model exported');
module.exports = mongoose.model('Items', Items);
