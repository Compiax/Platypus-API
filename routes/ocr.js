/**
 * @file This defines the routes to be used by the OCR componant.
 */
var debug     = require('debug')('platypus-api:routes:ocr');
var express   = require('express');
var ocr       = require('../controllers/ocr');

var router = express.Router();

debug('Adding route: POST /');
router.post('/detectText', ocr.detectText);

/**
 * Define route for the CreateSession function.
 */
debug('Adding route: POST /createSession')
router.post('/createSession', ocr.createSession);

debug('Tests router exported');
module.exports = router;
