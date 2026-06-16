const express = require('express');
const router = express.Router();
const controller = require('../Controllers/OrderController');
const requireAuth = require('../Middlewares/authMiddleware');
const verifyToken = require('../Middlewares/verifytoken');


router.route('/')
    .get(verifyToken, controller.getUserOrders)
    .post(verifyToken, controller.createOrder);

router.route('/:id')
    .get(verifyToken, controller.getOrderById)
    .patch(verifyToken, controller.updateOrder)
    .delete(verifyToken, controller.deleteOrder);

module.exports = router;