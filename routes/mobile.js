var debug     = require('debug')('platypus-api:routes:mobile');
var express   = require('express');
var mobile    = require('../controllers/mobile');


var router = express.Router();

router.post('/createSession', mobile.createSession);

router.post('/sendImage', mobile.sendImage);

router.post('/terminateSession', mobile.terminateSession);

debug('Mobile router exported');
module.exports = router;
