var debug			= require('debug')('platypus-api:helpers:database');
var dbutils		= require('./dbutils.js');
var bill			= require('./bill.js');

debug('Adding helper: dbutils');
module.exports.dbutils = dbutils;

debug('Adding helper: Bill');
module.exports.bill = bill;