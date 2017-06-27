var auth      = require('./auth');
var debug     = require('debug')('platypus-api:routes');
var express   = require('express');
var users     = require('./users');
var test     = require('./test');

var router = express.Router();

debug('Adding routes');
router.use('/auth', auth);
router.use('/test', test);
router.use('/users', users);

debug('Main router exported');
module.exports = router;
