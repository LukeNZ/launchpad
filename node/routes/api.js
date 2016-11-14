var express = require('express');
var path = require('path');
var router = express.Router();
var TMinusTenController = require('../controllers/TMinusTenController');
var tMinusTenController = new TMinusTenController();
var AuthController = require('../controllers/AuthController');
var authController = new AuthController();

router.get('/updates', tMinusTenController.getUpdates);

router.get('/status', tMinusTenController.getStatus);

router.get('/webcasts', tMinusTenController.getWebcasts);

router.get('/auth/login', authController.login);

router.get('/auth/logout', authController.logout);

module.exports = router;