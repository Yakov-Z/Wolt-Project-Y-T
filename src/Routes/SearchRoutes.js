const express = require('express');
const router = express.Router();
const controller = require('../Controllers/searchController');

router.route('/:query')
    .get(controller.searchEntities);

module.exports = router;