//connect to the data repository to get and manipulate restaurant data
const dataRepository = require('../Models/DataRepository');
const Product = require('../Models/Product');
const Restaurant = require('../Models/Restaurant');

//get all the restaurants, that save in the data repository, return the list of restaurants
const getAllRestaurants = (req, res) => {
    res.json(dataRepository.getAllRestaurants());
};

//add a new restaurant, return the created restaurant profile
const createRestaurant = (req, res) => {
    //get the restaurant details from the request body
    const { name, address } = req.body;
    
    //create and save the new restaurant to the data repository
    const newRestaurant = new Restaurant(null, name, address);
    const savedRestaurant = dataRepository.addRestaurant(newRestaurant);
    
    //return the restaurant profile
    res.json(savedRestaurant);
};

//get restaurant by its ID, return the restaurant profile
const getRestaurantById = (req, res) => {
     // ID is int in our implementation, so we convert it from string to number
    const id = Number(req.params.id);
    const restaurant = dataRepository.getRestaurant(id);
    //error if the restaurant don't exist
    if (!restaurant) {
        return res.json({ error: "Restaurant not found" });
    }
    //return the restaurant profile
    res.json(restaurant);
};

//change restaurant details by its ID
const updateRestaurant = (req, res) => {
     // ID is int in our implementation, so we convert it from string to number
    const id = Number(req.params.id);
    const restaurant = dataRepository.getRestaurant(id);
    
    //error if the restaurant don't exist
    if (!restaurant) {
        return res.json({ error: "Restaurant not found" });
    }
    
    //update the details that sent in the request body
    if (req.body.name) restaurant.name = req.body.name;
    if (req.body.address) restaurant.address = req.body.address;
    
    //return the new restaurant profile
    res.json(restaurant);
};

//delete restaurant by its ID
const deleteRestaurant = (req, res) => {
    // ID is int in our implementation, so we convert it from string to number
    const id = Number(req.params.id);
    //delete the restaurant from the data repository
    const isDeleted = dataRepository.deleteRestaurant(id); 
    
    //error if the restaurant don't exist
    if (!isDeleted) {
        return res.json({ error: "Restaurant not found" });
    }
    //
    res.json({});
};

//get the menu of a restaurant by its ID, and the menu array
const getRestaurantMenu = (req, res) => {
    // ID is int in our implementation, so we convert it from string to number
    const id = Number(req.params.id);
    const restaurant = dataRepository.getRestaurant(id);
    
     //error if the restaurant don't exist
    if (!restaurant) {
        return res.json({ error: "Restaurant not found" });
    }
    
    //return the menu array
    res.json(restaurant.menu);
};

const addProductToMenu = (req, res) => {
    // ID is int in our implementation, so we convert it from string to number
    const id = Number(req.params.id);
    const restaurant = dataRepository.getRestaurant(id);
    
    //error if the restaurant don't exist
    if (!restaurant) {
        return res.json({ error: "Restaurant not found" });
    }
    
    //get the product details from the request body
    const { name, price } = req.body;
    
    //create a new product object
    const newProduct = new Product(null, name, price);
    
    //add the product to the restaurant menu
    const savedProduct = restaurant.addProduct(newProduct);
    //return the added product
    res.json(savedProduct);
};

//get a specific product from the restaurant menu by the restaurant ID and the product ID
const getProductById = (req, res) => {
    // ID is int in our implementation, so we convert it from string to number
    const id = Number(req.params.id);
    const productId = Number(req.params.pId);
    //get the restaurant from the data repository
    const restaurant = dataRepository.getRestaurant(id);

    //error if the restaurant don't exist
    if (!restaurant) 
        return res.json({ error: "Restaurant not found" });
    
    //get the product from the restaurant menu
    const product = restaurant.menu.find(p => p.id === productId);
    //error if the product don't exist
    if (!product) {
        return res.json({ error: "Product not found" });
    }
    //return the product details
    res.json(product);
};

//update a specific product from the restaurant menu by the restaurant ID and the product ID
const updateProduct = (req, res) => {
    // ID is int in our implementation, so we convert it from string to number
    const id = Number(req.params.id);
    const productId = Number(req.params.pId);
    //get the restaurant from the data repository
    const restaurant = dataRepository.getRestaurant(id);
    //error if the restaurant don't exist
    if (!restaurant)
         return res.json({ error: "Restaurant not found" });
    
   //search for the product in the restaurant menu
    const product = restaurant.menu.find(p => p.id === productId);

     //error if the product don't exist
    if (!product)
         return res.json({ error: "Product not found" });
    
    //update the product details that sent in the request body
    if (req.body.name) product.name = req.body.name;
    if (req.body.price) product.price = req.body.price;
    
    //return the updated product details
    res.json(product);
};

//delete a specific product from the restaurant menu by the restaurant ID and the product ID
const deleteProduct = (req, res) => {
    // ID is int in our implementation, so we convert it from string to number
    const id = Number(req.params.id);
    const productId = Number(req.params.pId);
    
    //get the restaurant from the data repository
    const restaurant = dataRepository.getRestaurant(id);
    //error if the restaurant don't exist
    if (!restaurant) {
         return res.json({ error: "Restaurant not found" });
    }
    
    //find the index of the product in the menu
    const index = restaurant.menu.findIndex(p => p.id === productId);
        
    //error if the product don't exist
    if (index === -1) {
        return res.json({ error: "Product not found" });
    }
    
    //delete the product from the restaurant menu
    restaurant.menu.splice(index, 1); 
    
    res.json({});
};

module.exports = {
    getAllRestaurants,
    createRestaurant,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant,
    getRestaurantMenu,
    addProductToMenu,
    getProductById,
    updateProduct,
    deleteProduct

};