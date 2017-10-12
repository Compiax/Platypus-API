/**
 * @file Defines the routes used by the mobile application for communiction
 * with the API
 */
var debug     = require('debug')('platypus-api:routes:mobile');
var express   = require('express');
var mobile    = require('../controllers/mobile');


var router = express.Router();
/**
 * Define route for the createSession function.
 */
router.post('/createSession', mobile.createSession);

/**
 * Define Route for the joinSession function.
 */
router.post('/joinSession', mobile.joinSession);

/**
 * Define Route for the sendImage function.
 */
router.post('/sendImage', mobile.sendImage);


router.post('/getUsers', mobile.getUsers);


router.post('/getOwner', mobile.getOwner);

router.post('/leaveSession', mobile.leaveSession);


/**
 * Define route for the terminateSession function.
 */
router.post('/terminateSession', mobile.terminateSession);

/**
 * Define route for the terminateSession function.
 */
router.post('/getAllSessionData', mobile.getAllSessionData);

debug('Mobile router exported');
module.exports = router;
