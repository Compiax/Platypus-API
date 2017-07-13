var debug     = require('debug')('platypus-api:routes');
var express   = require('express');
var test     = require('./test');
var mobile     = require('./mobile');

var router = express.Router();

debug('Adding routes');

router.use('/test', test);
router.use('/mobile', mobile);

debug('Main router exported');
module.exports = router;
