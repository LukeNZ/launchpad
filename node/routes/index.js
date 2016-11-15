var express = require('express');
var router = express.Router();
var HomeController = require('../controllers/HomeController');
var homeController = new HomeController();

/* GET home page. */
router.get('/', homeController.home);

/* Wildcard route for frontend router */
router.get('*', homeController.home);

module.exports = router;
