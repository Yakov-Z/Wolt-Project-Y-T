const express = require('express');
const router = express.Router();
const controller = require('../Controllers/RestaurantController');
const searchController = require('../Controllers/searchController');
const ProductsRoutes = require('./ProductsRoutes');
const verifyToken = require('../Middlewares/verifytoken');


router.route('/')
    .get(controller.getAllRestaurants)
    .post(verifyToken, controller.createRestaurant);

    router.get('/search/:query', searchController.searchEntities);


router.get('/category', controller.getExistingCategories);


router.get('/popular', controller.getPopularRestaurants);

router.get('/nearby', controller.getNearbyRestaurants);

router.route('/:id')
    .get(controller.getRestaurantById)
    .patch(verifyToken, controller.updateRestaurant)
    .delete(verifyToken, controller.deleteRestaurant);


router.use('/:id/products', ProductsRoutes);

module.exports = router;