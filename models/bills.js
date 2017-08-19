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
}, {
    toJSON: {
        virtuals: true
    }
});

module.exports = mongoose.model('Bills', Bills);
