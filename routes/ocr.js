var debug     = require('debug')('platypus-api:routes:ocr');
var express   = require('express');
var ocr       = require('../controllers/ocr');

var router = express.Router();

debug('Adding route: GET /');
router.post('/detectText', ocr.detectText);

debug('Tests router exported');
module.exports = router;
