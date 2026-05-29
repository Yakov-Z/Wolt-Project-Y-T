const express = require('express');
const router = express.Router();
const controller = require('../Controllers/OrderController');

router.route('/')
    .get(controller.getUserOrders)
    .post(controller.createOrder);

router.route('/:id')
    .get(controller.getOrderById)
    .patch(controller.updateOrder)
    .delete(controller.deleteOrder);

module.exports = router;