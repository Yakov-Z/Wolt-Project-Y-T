const express = require('express');
const router = express.Router();
const controller = require('../Controllers/RestaurantController');
const searchController = require('../Controllers/searchController');
const ProductsRoutes = require('./ProductsRoutes');


router.route('/')
    .get(controller.getAllRestaurants)
    .post(controller.createRestaurant);

    router.get('/search/:query', searchController.searchEntities);


router.get('/category', controller.getExistingCategories);


router.get('/category/:category', controller.getRestaurantsByCategory);


router.get('/popular', controller.getPopularRestaurants);


router.route('/:id')
    .get(controller.getRestaurantById)
    .patch(controller.updateRestaurant)
    .delete(controller.deleteRestaurant);


router.use('/:id/products', ProductsRoutes);

module.exports = router;