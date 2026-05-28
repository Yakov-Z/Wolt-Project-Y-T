const express = require('express');
const router = express.Router();
const controller = require('../Controllers/UserController');

router.route('/')
    .post(controller.loginUser);

module.exports = router;