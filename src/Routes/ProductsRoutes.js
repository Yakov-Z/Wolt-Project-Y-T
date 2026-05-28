const express = require('express');
const router = express.Router();
const controller = require('../Controllers/RestaurantController');

router.route('/')
    .get(controller.getRestaurantMenu)
    .post(controller.addProductToMenu);

router.route('/:pld')
    .get(controller.getProductById)
    .patch(controller.updateProduct)
    .delete(controller.deleteProduct);

module.exports = router;