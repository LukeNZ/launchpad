var express = require('express');
var path = require('path');
var router = express.Router();
var ApiController = require('../controllers/ApiController');
var apiController = new ApiController();

router.get('/updates', apiController.getUpdates);

router.get('/status', apiController.getStatus);

router.get('/webcasts', apiController.getWebcasts);

module.exports = router;