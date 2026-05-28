const express = require('express');
const router = express.Router();
const controller = require('../Controllers/RestaurantController');

router.route('/')
    .get(controller.getAllRestaurants)
    .post(controller.createRestaurant);

router.route('/:id')
    .get(controller.getRestaurantById)
    .patch(controller.updateRestaurant)
    .delete(controller.deleteRestaurant);

router.use('/:id/products', ProductsRoutes);

module.exports = router;