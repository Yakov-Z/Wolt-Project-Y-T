
const Product = require('../Models/Product');
const Restaurant = require('../Models/Restaurant');
const Restaurant = require('../Models/Order');
const Restaurant = require('../Models/User');
const { sendCommand } = require('../Services/tcpClient');
const { genericBubbleSort } = require('../Helpers/GenericBubbleSort');

//get all the restaurants, return the list of restaurants
const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        
        res.status(200).json(restaurants);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};
//add a new restaurant, return the created restaurant profile
const createRestaurant = async (req, res) => {
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
    if(!address || !address.city || !address.street || !address.number || address.latitude == null || address.longitude == null) {
        errors.address = "complete address is required";
     }

     // sent the errors to the client if there are any
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors }); 
    }

    try {

    //create and save the new restaurant to the data repository
   const newRestaurant = new Restaurant({
            owner: owner, 
            name: name,
            description: description,
            address: address,
            category: category,
            image: image,
            logo: logo,
            kosher: kosher
        });
    const savedRestaurant = await newRestaurant.save();
    
    //return the restaurant profile
    res.status(201).json(savedRestaurant);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

//get restaurant by its ID, return the restaurant profile
const getRestaurantById = async (req, res) => {
    try{
     
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid restaurant ID format" });
        }

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
    }

    if (restaurant.views === undefined || restaurant.views === null) {
        restaurant.views = 0;
    }

    // 3. NOW it's safe to increment
    restaurant.views += 1;

    await restaurant.save();

    //return the restaurant profile
    res.json(restaurant);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};


//change restaurant details by its ID
const updateRestaurant = async (req, res) => {
    try {
     
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid restaurant ID format" });
        }

    const restaurant = await Restaurant.findById(id);
    
    //error if the restaurant don't exist
    if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
    }

    if(String(restaurant.owner) != String(req.user.id)) {
        return res.status(403).json({ error: "You are not the owner of this restaurant" });
    }

    //update the details that sent in the request body
    if (req.body.name) restaurant.name = req.body.name;
    if (req.body.address) {
    restaurant.address = { ...restaurant.address, ...req.body.address };
        }
    if (req.body.category) restaurant.category = req.body.category;
    if (req.body.description) restaurant.description = req.body.description;
    if (req.body.owner) restaurant.owner = req.body.owner;
    if (req.body.kosher != null) restaurant.kosher = req.body.kosher;
    if (req.body.image) restaurant.image = req.body.image;
    if (req.body.logo) restaurant.logo = req.body.logo;

     await restaurant.save();

    //return the new restaurant profile
    res.json(restaurant);
     } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

//delete restaurant by its ID
const deleteRestaurant = async (req, res) => {
    try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid restaurant ID format" });
        }

    //delete the restaurant from the data repository
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
    }
    if(String(restaurant.owner) != String(req.user.id)) {
        return res.status(403).json({ error: "You are not the owner of this restaurant" });
    }
    
    const ordersToDelete = await Order.find({ restaurantID: id });
        const orderIds = ordersToDelete.map(order => order._id);

        for (const order of ordersToDelete) {
            const productIds = order.productsIDs; 
            
            if (productIds && productIds.length > 0) {
                
                const productIdsFordel = productIds.map(pid => String(pid));
                sendCommand('delete', String(order.userID), ...productIdsFordel);
            }
        }

       
        await Order.deleteMany({ restaurantID: id });

       
        if (orderIds.length > 0) {
            await User.updateMany(
                { orders: { $in: orderIds } }, 
                { $pull: { orders: { $in: orderIds } } } 
            );
        }

    
    await Product.deleteMany({ restaurantID: id });
   
    await Restaurant.findByIdAndDelete(id);

    res.status(204).send();
     } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

//get the menu of a restaurant by its ID, and the menu array
const getRestaurantMenu = async (req, res) => {
    try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid restaurant ID format" });
        }

    const restaurant = await Restaurant.findById(id).populate('menu');
    
     //error if the restaurant don't exist
    if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
    }
    
    //return the menu array
    res.json(restaurant.menu);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

const addProductToMenu = async (req, res) => {
    try{
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid restaurant ID format" });
        }

    const restaurant = await Restaurant.findById(id);
    
    //error if the restaurant don't exist
    if (!restaurant) {
        return res.status(404).json({ error: "Restaurant not found" });
    }

    if(String(restaurant.owner) !== String(req.user.id)) {
            return res.status(403).json({ error: "You are not the owner of this restaurant" });
        }
    
    //get the product details from the request body
    const { name, description, price, category, image } = req.body;
    const numericPrice = Number(price);

    // we will save the errors and sent them to the client if there are any
    let errors = {};
        if(!name) {
        errors.name = "name is required";
    }
    if(price == null || price == undefined) {
        errors.price = "price is required";
    } else if (isNaN(numericPrice) || numericPrice < 0) {
        errors.price = "price must be a non-negative number";
    }
    if(!category) {
        errors.category = "category is required";
    }
    if(!image) {
        errors.image = "image is required";
    }

    // sent the errors to the client if there are any
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors }); 
    }
    
    //create a new product object
    const newProduct = new Product(null, name, description, category, numericPrice, image, restaurant.id);
    const newProduct = new Product({ 
            name: name,
            description: description,
            category: category,
            image: image,
            image: image,
            restaurantID: restaurant._id
        });
        const savedProduct = await newProduct.save();
    
    //add the product to the restaurant menu
        restaurant.menu.push(savedProduct._id);
        await restaurant.save();
    
    //return the added product
    res.status(201).json(savedProduct);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

//get a specific product from the restaurant menu by the restaurant ID and the product ID
const getProductById = async (req, res) => {
    try {
    const id = req.params.id;
    const productId = req.params.pId;
    
     if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: "Invalid restaurant or product ID format" });
        }
    const restaurant = await Restaurant.findById(id);
    // Extracting user ID from the headers
    const userId = req.headers['userid'];

   

    //error if the restaurant don't exist
    if (!restaurant) 
        return res.status(404).json({ error: "Restaurant not found" });
    
    //get the product from the restaurant menu
    const product = await Product.findById(productId);
    //error if the product don't exist
    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }
    if (product.views === undefined || product.views === null) {
        product.views = 0;
    }
    product.views += 1;
    await product.save();

    // If the user is logged in, send his product view to the recommendation server
    if(userId) {
        const user = await User.findById(userId);
        if(user) {
            sendCommand('patch', user.id, productId); 
            user.userview.push(productId);
            await user.save();
        }
    }
    //return the product details
    res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

//update a specific product from the restaurant menu by the restaurant ID and the product ID
const updateProduct = async (req, res) => {
    try{
    
    const id = req.params.id;
    const productId = req.params.pId;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: "Invalid restaurant or product ID format" });
        }

    
    const restaurant = await Restaurant.findById(id);
    //error if the restaurant don't exist
    if (!restaurant)
         return res.status(404).json({ error: "Restaurant not found" });
    
    if(String(restaurant.owner) !== String(req.user.id)) {
            return res.status(403).json({ error: "You are not the owner of this restaurant" });
        }

   //search for the product in the restaurant menu
    const product = await Product.findById(productId);

     //error if the product don't exist
    if (!product)
         return res.status(404).json({ error: "Product not found" });
    
    //update the product details that sent in the request body
    if (req.body.name) product.name = req.body.name;
    if (req.body.price) product.price = req.body.price;
    if (req.body.image) product.image = req.body.image;

    await product.save();
    
    //return the updated product details
    res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

//delete a specific product from the restaurant menu by the restaurant ID and the product ID
const deleteProduct = async (req, res) => {
    try {
    const id_restaurant = req.params.id;
    const productId = req.params.pId;

    if (!mongoose.Types.ObjectId.isValid(id_restaurant) || !mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: "Invalid restaurant or product ID format" });
        }
    
    //get the restaurant from the data repository
    const restaurant = await Restaurant.findById(id_restaurant);

    //error if the restaurant don't exist
    if (!restaurant) {
         return res.status(404).json({ error: "Restaurant not found" });
    }

    if (String(restaurant.owner) !== String(req.user.id)) {
            return res.status(403).json({ error: "You are not the owner of this restaurant" });
        }

        const product = await Product.findById(productId);
        if (!product || String(product.restaurantID) !== String(id_restaurant)) {
            return res.status(404).json({ error: "Product not found" });
        }

    const affectedOrders = await Order.find({ productsIDs: productId });

    for (const order of affectedOrders) {
   
        order.productsIDs = order.productsIDs.filter(id => String(id) !== String(productId));
    
    
        order.totalPrice -= product.price;
        if (order.totalPrice < 0) order.totalPrice = 0;
    
        await order.save();
   
        sendCommand('delete', String(order.userID), String(productId));
}


    const usersWhoViewed = await User.find({ userview: productId });

    for (const user of usersWhoViewed) {
        sendCommand('delete', String(user._id), String(productId));
    }


    await User.updateMany(
        { userview: productId },
        { $pull: { userview: productId } }
    );

    restaurant.menu.pull(productId);
    await restaurant.save();

    await Product.findByIdAndDelete(productId);

    res.status(204).send();
     } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

const getPopularProducts = async (req, res) => {
    try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid restaurant ID format" });
        }

    const restaurant = await Restaurant.findById(id).populate('menu');
    
    if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });

   
    const topProducts = genericBubbleSort(restaurant.menu, 'views', true).slice(0, 3);
    res.json(topProducts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};



const getPopularRestaurants = async (req, res) => {
    try {
        
        const popularRestaurants = await Restaurant.find()
            .sort({ views: -1 })
            .limit(20);

        res.status(200).json(popularRestaurants);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};


const getExistingCategories = async (req, res) => {
    try {
    
    const categories = await Restaurant.distinct('category');
    
    res.json(categories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};


const calculateSimpleDistance = (lat1, lon1, lat2, lon2) => {
    const x = lat2 - lat1;
    const y = lon2 - lon1;
    
    const flatDistance = Math.sqrt(x * x + y * y);
    
    return flatDistance * 111; 
};

const getNearbyRestaurants = async (req, res) => {
    try {
    const userId = req.headers['userid'];
    const user = await User.findById(userId);

    const allRestaurants = await Restaurant.find({});

    // Make sure the user has a valid address before trying to calculate
    if (!user || !user.address || user.address.latitude == null || user.address.longitude == null) {
        return res.json(allRestaurants.slice(0, 20));
    }


    let calculatedRestaurants = allRestaurants.map(restaurant => {
        // Protect against missing restaurant addresses
        if (!restaurant.address || restaurant.address.latitude == null || restaurant.address.longitude == null) {
            return {
                ...restaurant.toObject(),
                distanceFromUser: Infinity // Push to the end of the sorted list
            };
        }
        
        const calculatedDistance = calculateSimpleDistance(
            user.address.latitude,   
            user.address.longitude,  
            restaurant.address.latitude, 
            restaurant.address.longitude
        );

        return {
            ...restaurant.toObject(),
            distanceFromUser: Number(calculatedDistance.toFixed(1))
        };
    });

    calculatedRestaurants = genericBubbleSort(calculatedRestaurants, 'distanceFromUser', false);
    const top20Closest = calculatedRestaurants.slice(0, 20);

    res.json(top20Closest);
     } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
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
    getPopularProducts,
    getPopularRestaurants,
    getExistingCategories,
    getNearbyRestaurants,
    calculateSimpleDistance

};