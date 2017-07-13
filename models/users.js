var bcrypt      = require('bcryptjs');
var debug       = require('debug')('platypus-api:models:users');
var mongoose    = require('mongoose');

// Typedefs for easier usage.
var ObjectId    = mongoose.Schema.Types.ObjectId;
var Schema      = mongoose.Schema;

debug('Defining schema: Session');
var Users = new Schema({
  u_id          : String,
  u_owner       : Boolean,
  u_nickname    : String,
  u_color       : String
});

debug('Users model exported');
module.exports = mongoose.model('Users', Users);
