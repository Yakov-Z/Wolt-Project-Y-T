const Restaurant = require('../Models/Restaurant');
const Product = require('../Models/Product'); // Must require Product model for independent search

// Search for restaurants and products that match the search query using MongoDB regex
const searchEntities = async (req, res) => {

    if (!req.params.query) {
        return res.json({ restaurants: [], products: [] });
    }
    
    // Get the search query from params
    const query = req.params.query;
    
    try {
        // Search restaurants directly in the database (case-insensitive)
        const matchedRestaurants = await Restaurant.find({ 
            name: { $regex: query, $options: 'i' } 
        });
        
        // Search products directly in the database and populate the restaurant details
        const matchedProductsDB = await Product.find({ 
            name: { $regex: query, $options: 'i' } 
        }).populate('restaurantID', 'name');

        // Create an array of products formatted exactly as the frontend expects
        const formattedProducts = matchedProductsDB.map(product => {
            return {
                restaurantId: product.restaurantID ? product.restaurantID._id : null,
                restaurantName: product.restaurantID ? product.restaurantID.name : "Unknown",
                productId: product._id,
                productName: product.name,
                price: product.price
            };
        });

        // Create the final object to send back
        const searchResults = {
            restaurants: matchedRestaurants,
            products: formattedProducts
        };

        // Return the search results
        res.status(200).json(searchResults);
        
    } catch (err) {
        console.error("Search error in database:", err);
        res.status(500).json({ error: "Search error" });
    }
};

module.exports = {
    searchEntities
};