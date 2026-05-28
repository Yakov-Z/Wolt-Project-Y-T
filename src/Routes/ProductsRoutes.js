const express = require('express');
const router = express.Router({ mergeParams: true });
const controller = require('../Controllers/RestaurantController');

router.route('/')
    .get(controller.getRestaurantMenu)
    .post(controller.addProductToMenu);

router.route('/:pId')
    .get(controller.getProductById)
    .patch(controller.updateProduct)
    .delete(controller.deleteProduct);

module.exports = router;