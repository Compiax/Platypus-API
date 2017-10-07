var debug           = require('debug')('platypus-api:helpers:mobile');
var mobile          = require('./mobile.js');
var bill          = require('./bill.js');

debug('Adding helper method: generateBillID');
module.exports.mobile = mobile;

debug('Adding helper method: generateBillID');
module.exports.bill = bill;