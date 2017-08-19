var debug     = require('debug')('platypus-api:routes:ocr');
var express   = require('express');
var ocr     = require('../controllers/ocr');

var router = express.Router();

debug('Adding route: POST /');
router.post('/detect', ocr.detect);

debug('OCR router exported');
module.exports = router;
