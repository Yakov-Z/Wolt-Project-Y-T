const express = require('express');
const router = express.Router();
const controller = require('../Controllers/UserController');
const verifyToken = require('../Middlewares/verifytoken');

router.route('/')
    .post(controller.registerUser);

router.route('/:id')
    .get(verifyToken, controller.getUserProfile);

module.exports = router;