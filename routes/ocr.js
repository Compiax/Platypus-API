var debug     = require('debug')('platypus-api:routes:ocr');
var express   = require('express');
var ocr     = require('../controllers/ocr');

var router = express.Router();

router.post('/createSession', ocr.createSession);

debug('OCR router exported');
module.exports = router;
