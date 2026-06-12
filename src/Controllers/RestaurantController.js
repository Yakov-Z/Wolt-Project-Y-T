//connect to the data repository to get and manipulate restaurant data
const dataRepository = require('../Models/DataRepository');
const Product = require('../Models/Product');
const Restaurant = require('../Models/Restaurant');
const { sendCommand } = require('../Services/tcpClient');
const { viewsSort } = require('../Helpers/sorters');

//get all the restaurants, that save in the data repository, return the list of restaurants
const getAllRestaurants = (req, res) => {
    res.json(dataRepository.getAllRestaurants());
};

//add a new restaurant, return the created restaurant profile
const createRestaurant = (req, res) => {
    //get the restaurant details from the request body
    
    const { name, address, category, description, owner, kosher, image, logo } = req.body;
    // we will save the errors and sent them to the client if there are any
    let errors = {};

    if(!name) {
        errors.name = "name is required";
    }
    if(!description) {
        errors.description = "description is required";
    }
    if(!owner) {
        errors.owner = "owner is required";
    }
    if(!image) {
        errors.image = "image is required";
    }
    if(!logo) {
        errors.logo = "logo is required";
    }
    if(!category) {
        errors.category = "category is required";
    }
    if(kosher == null || kosher == undefined) {
        errors.kosher = "kosher status is required";
    }
    if(!address || !address.city || !address.street || !address.number) {
        errors.address = "complete address is required";
     }

     // sent the errors to the client if there are any
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors }); 
    }

    //create and save the new restaurant to the data repository
    const newRestaurant = new Restaurant(null, owner, description, name, address, category, image, logo, kosher);
    const savedRestaurant = dataRepository.addRestaurant(newRestaurant);
    
    //return the restaurant profile
    res.status(201).json(savedRestaurant);
};

//get restaurant by its ID, return the restaurant profile
const getRestaurantById = (req, res) => {
     // ID is int in our implementation, so we convert it from string to number
    const id = Number(req.params.id);
    const restaurant = dataRepository.getRestaurant(id);
    restaurant.views += 1;
    //error if the restaurant don't exist
    if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
    }
    //return the restaurant profile
    res.json(restaurant);
};

//get restaurants by category, return the list of restaurants in the category
const getRestaurantsByCategory = (req, res) => {

    if (!req.params.category) {
        return res.json([]);
    }

    const category = req.params.category.toLowerCase();
    const allRestaurants = dataRepository.getAllRestaurants();
    const restaurantsInCategory = allRestaurants.filter(restaurant => {
        
        const currentCategory = (restaurant.category || '').toLowerCase();
        return currentCategory === category;
    });
    res.json(restaurantsInCategory);
};

//change restaurant details by its ID
const updateRestaurant = (req, res) => {
     // ID is int in our implementation, so we convert it from string to number
    const id = Number(req.params.id);
    const restaurant = dataRepository.getRestaurant(id);
    
    //error if the restaurant don't exist
    if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
    }
    
    //update the details that sent in the request body
    if (req.body.name) restaurant.name = req.body.name;
    if (req.body.address) restaurant.address = req.body.address;
    if (req.body.category) restaurant.category = req.body.category;
    if (req.body.description) restaurant.description = req.body.description;
    if (req.body.owner) restaurant.owner = req.body.owner;
    if (req.body.kosher != null) restaurant.kosher = req.body.kosher;
    if (req.body.image) restaurant.image = req.body.image;
    if (req.body.logo) restaurant.logo = req.body.logo;

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
        return res.status(404).json({ error: "Restaurant not found" });
    }
    // delete the restaurant's orders and products from the data repository
    const productsToDelete = [];
    for(const product of dataRepository.products.values()) {
        if(product.restaurantID == id) {
            productsToDelete.push(product.id);
        }
    }


    for(const productId of productsToDelete) {
        dataRepository.deleteProduct(productId);
    }

    
    for (const user of dataRepository.users.values()) {
    if (!user.orders) continue; 

 
    const ordersToDelete = user.orders.filter(order => order.restaurantID === id);

    for (const order of ordersToDelete) {
        
        const productIds = order.productsIDs; 
        
        if (productIds && productIds.length > 0) {
            sendCommand('delete', user.id, ...productIds);
        }
        
        dataRepository.deleteOrder(order.id);
    }

    user.orders = user.orders.filter(order => order.restaurantID !== id);
}
   
    res.status(204).send();
};

//get the menu of a restaurant by its ID, and the menu array
const getRestaurantMenu = (req, res) => {
    // ID is int in our implementation, so we convert it from string to number
    const id = Number(req.params.id);
    const restaurant = dataRepository.getRestaurant(id);
    
     //error if the restaurant don't exist
    if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
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
        return res.status(404).json({ error: "Restaurant not found" });
    }
    
    //get the product details from the request body
    const { name, price , category} = req.body;

    // we will save the errors and sent them to the client if there are any
    let errors = {};
        if(!name) {
        errors.name = "name is required";
    }
    if(price == null || price == undefined) {
        errors.price = "price is required";
    } else if (typeof price !== 'number' || price < 0) {
        errors.price = "price must be a non-negative number";
    }
    if(!category) {
        errors.category = "category is required";
    }

    // sent the errors to the client if there are any
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors }); 
    }
    
    //create a new product object
    const newProduct = new Product(null, name, price, restaurant.id);
    
    //add the product to the restaurant menu
    const savedProduct = restaurant.addProduct(newProduct);
    dataRepository.addProduct(savedProduct);
    //return the added product
    res.status(201).json(savedProduct);
};

//get a specific product from the restaurant menu by the restaurant ID and the product ID
const getProductById = (req, res) => {
    // ID is int in our implementation, so we convert it from string to number
    const id = Number(req.params.id);
    const productId = Number(req.params.pId);
    //get the restaurant from the data repository
    const restaurant = dataRepository.getRestaurant(id);
    // Extracting user ID from the headers
    const userId = req.headers['userid'];

    //error if the restaurant don't exist
    if (!restaurant) 
        return res.status(404).json({ error: "Restaurant not found" });
    
    //get the product from the restaurant menu
    const product = restaurant.menu.find(p => p.id === productId);
    //error if the product don't exist
    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }
    product.views += 1;
    // If the user is logged in, send his product view to the recommendation server
    if(userId) {
        const user = dataRepository.getUser((Number(userId)));
        if(user) {
            sendCommand('patch', user.id, productId); 
            user.userview.push(productId);
        }
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
         return res.status(404).json({ error: "Restaurant not found" });
    
   //search for the product in the restaurant menu
    const product = restaurant.menu.find(p => p.id === productId);

     //error if the product don't exist
    if (!product)
         return res.status(404).json({ error: "Product not found" });
    
    //update the product details that sent in the request body
    if (req.body.name) product.name = req.body.name;
    if (req.body.price) product.price = req.body.price;
    
    //return the updated product details
    res.json(product);
};

//delete a specific product from the restaurant menu by the restaurant ID and the product ID
const deleteProduct = (req, res) => {
    // ID is int in our implementation, so we convert it from string to number
    const id_restaurant = Number(req.params.id);
    const productId = Number(req.params.pId);
    
    //get the restaurant from the data repository
    const restaurant = dataRepository.getRestaurant(id_restaurant);
    //error if the restaurant don't exist
    if (!restaurant) {
         return res.status(404).json({ error: "Restaurant not found" });
    }

    //find the index of the product in the menu
    const index = restaurant.menu.findIndex(p => p.id === productId);
        
    //error if the product don't exist
    if (index === -1) {
        return res.status(404).json({ error: "Product not found" });
    }

    const product = restaurant.menu[index];

    //delete the product from the data repository
    dataRepository.deleteProduct(productId);
    //delete the product from the restaurant menu
    restaurant.menu.splice(index, 1); 
    
    for (const user of dataRepository.users.values()) {
            
        // check if the user ordered the product
        const hasOrdered = user.orders && user.orders.some(order => 
            order.productsIDs && order.productsIDs.includes(productId)
        );

        // check if the user viewed the product
        const hasViewed = user.userview && user.userview.includes(productId);

        // if the user either ordered or viewed the product, we need to update
        if (hasOrdered || hasViewed) {
            
            // clean up orders if necessary
            if (hasOrdered) {
                user.orders.forEach(order => {
                    if (order.productsIDs) {
                        order.productsIDs = order.productsIDs.filter(id => id !== productId);
                        order.totalPrice -= product.price;
                    }
                });
            }

            // clean up views if necessary
            if (hasViewed) {
                user.userview = user.userview.filter(id => id !== productId);
            }

            // send delete command to the recommendation server
            sendCommand('delete', user.id, productId);
        }
    }

    res.status(204).send();
};

const getPopularProducts = (req, res) => {
    const id = Number(req.params.id);
    const restaurant = dataRepository.getRestaurant(id);
    
    if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });

   
    const topProducts = viewsSort(restaurant.menu).slice(0, 3);
    res.json(topProducts);
};



const getPopularRestaurants = (req, res) => {
    const allRestaurants = dataRepository.getAllRestaurants();
    
    
    const popularRestaurants = viewsSort(allRestaurants).slice(0, 20);
    res.json(popularRestaurants);
};

//get products by category, return the list of products in the category
const getProductsByCategory = (req, res) => {

    if (!req.params.category) {
        return res.json([]);
    }

    const id = Number(req.params.id);
    const restaurant = dataRepository.getRestaurant(id);
    
    if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });

    const category = req.params.category.toLowerCase();
    const allProducts = restaurant.menu;
    const productsInCategory = allProducts.filter(product => {
        
        const currentCategory = (product.category || '').toLowerCase();
        return currentCategory === category;
    });
    res.json(productsInCategory);
};

const getExistingCategories = (req, res) => {
    const allRestaurants = dataRepository.getAllRestaurants();
    
    const categories = [];
    
    allRestaurants.forEach(restaurant => {
        if (restaurant.category && !categories.includes(restaurant.category.toLowerCase())) {
            categories.push(restaurant.category.toLowerCase());
        }
    });
    
    res.json(categories);
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
    deleteProduct,
    getProductsByCategory,
    getPopularProducts,
    getPopularRestaurants,
    getExistingCategories
    
};