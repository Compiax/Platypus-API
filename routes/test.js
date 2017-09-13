var debug     = require('debug')('platypus-api:routes:test');
var express   = require('express');
var test     = require('../controllers/test');

var router = express.Router();

debug('Adding route: GET /');
router.get('/', test.testFunction);

//@todo add second parameter
router.post('/createSession', test.createSession);

debug('Tests router exported');
module.exports = router;
