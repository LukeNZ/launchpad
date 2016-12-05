var express = require('express');
var path = require('path');
var router = express.Router();
var LaunchpadController = require('../controllers/LaunchpadController');
var AuthController = require('../controllers/AuthController');

var launchpadController = new LaunchpadController();
var authController = new AuthController();

router.get('/launchpad', launchpadController.getLaunchpad.bind(launchpadController));

router.get('/statuses', launchpadController.getStatuses.bind(launchpadController));

router.get('/launch', launchpadController.getLaunch.bind(launchpadController));

router.post('/auth/login', authController.login.bind(authController));

module.exports = router;