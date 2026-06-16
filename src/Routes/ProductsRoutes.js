const express = require('express');
const router = express.Router({ mergeParams: true });
const controller = require('../Controllers/RestaurantController');
const verifyToken = require('../Middlewares/verifytoken');

router.route('/')
    .get(controller.getRestaurantMenu)
    .post(verifyToken, controller.addProductToMenu);

router.route('/:pId')
    .get(controller.getProductById)
    .patch(verifyToken, controller.updateProduct)
    .delete(verifyToken, controller.deleteProduct);

module.exports = router;