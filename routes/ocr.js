/**
 * @file This defines the routes to be used by the OCR componant.
 */
var debug     = require('debug')('platypus-api:routes:ocr');
var express   = require('express');
var ocr     = require('../controllers/ocr');

var router = express.Router();
/**
 * Define route for the CreateSession function.
 */
router.post('/createSession', ocr.createSession);

debug('OCR router exported');
module.exports = router;
