//connect to the data repository to get restaurant and product data
const dataRepository = require('../Models/DataRepository');

//search for restaurants and products that match the search query
const searchEntities = (req, res) => {
    //get the search query and convert it to lowercase for convenient search
    const query = req.params.query.toLowerCase();
    
    //get all the restaurants from the data repository
    const allRestaurants = dataRepository.getAllRestaurants();
    
    //create an object to store the search results for restaurants and products
    const searchResults = {
        restaurants: [],
        products: []
    };

    //iterate over all the restaurants to find matches
    allRestaurants.forEach(restaurant => {
        //add the restaurant to the results if its name contains the search query
        if (restaurant.name.toLowerCase().includes(query)) {
            searchResults.restaurants.push(restaurant);
        }

        //iterate over the restaurant menu to find matching products
        restaurant.menu.forEach(product => {
            //add the product to the results if its name contains the search query
            if (product.name.toLowerCase().includes(query)) {
                //save the product details along with its restaurant
                searchResults.products.push({
                    restaurantId: restaurant.id,
                    restaurantName: restaurant.name,
                    productId: product.id,
                    productName: product.name,
                    price: product.price
                });
            }
        });
    });

    //return the search results
    res.json(searchResults);
};

module.exports = {
    searchEntities
};