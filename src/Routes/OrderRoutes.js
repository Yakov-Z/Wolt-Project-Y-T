const express = require('express');
const router = express.Router();
const controller = require('../Controllers/OrderController');
const requireAuth = require('../Middlewares/authMiddleware');

router.route('/')
    .get(requireAuth, controller.getUserOrders)
    .post(requireAuth, controller.createOrder);

router.route('/:id')
    .get(requireAuth, controller.getOrderById)
    .patch(requireAuth, controller.updateOrder)
    .delete(requireAuth, controller.deleteOrder);

module.exports = router;