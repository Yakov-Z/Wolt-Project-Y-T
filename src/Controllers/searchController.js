
const Restaurant = require('../Models/Restaurant');

//search for restaurants and products that match the search query
const searchEntities = async (req, res) => {

    if (!req.params.query) {
        return res.json({ restaurants: [], products: [] });
    }
    
    //get the search query and convert it to lowercase for convenient search
    const query = req.params.query.toLowerCase();
    
    try {
    //get all the restaurants from the data repository
    const allRestaurants = await Restaurant.find();
    
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
                    restaurantId: restaurant._id,
                    restaurantName: restaurant.name,
                    productId: product._id,
                    productName: product.name,
                    price: product.price
                });
            }
        });
    });

    //return the search results
    res.json(searchResults);
    } catch (err) {
        res.status(500).json({ error: "Search error" });
    }
};

module.exports = {
    searchEntities
};