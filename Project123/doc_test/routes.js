const express = require('express');
const router = express.Router();
const controllers = require('./controllers');

router.post('/signup', controllers.signup);
router.post('/signin', controllers.signin);
router.post('/topic', controllers.addTopic);

module.exports = router;
