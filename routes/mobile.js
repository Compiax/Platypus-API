var debug     = require('debug')('platypus-api:routes:mobile');
var express   = require('express');
var mobile    = require('../controllers/mobile');
var multer    = require('multer');
var upload    = multer({ dest: '../uploads/' });

var router = express.Router();

router.post('/createSession', mobile.createSession);

router.post('/sendImage', upload.single('bill'), mobile.sendImage);

debug('Mobile router exported');
module.exports = router;
