var express = require('express');
var path = require('path');
var router = express.Router();
var TMinusTenController = require('../controllers/TMinusTenController');
var AuthController = require('../controllers/AuthController');

var tMinusTenController = new TMinusTenController();
var authController = new AuthController();

router.get('/updates', tMinusTenController.getUpdates);

router.get('/status', tMinusTenController.getStatus);

router.get('/webcasts', tMinusTenController.getWebcasts);

router.post('/auth/login', authController.login.bind(authController));

module.exports = router;