const express = require('express');
const router = express.Router();
const controller = require('../Controllers/UserController');

router.route('/')
    .post(controller.registerUser);

router.route('/:id')
    .get(controller.getUserProfile);

module.exports = router;