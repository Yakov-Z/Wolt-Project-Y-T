const Order = require('../Models/Order');
const User = require('../Models/User');
const userService = require('../Services/userService');
const { sendCommand } = require('../Services/tcpClient');

//create a new order for the connected user
const createOrder = async (req, res) => {
    try {
        //get the user object from the request
        const user = req.user;
        const userId = req.user.id;
        const realUser = await User.findById(userId);
        if (!realUser) {
            return res.status(404).json({ error: "User not found" });
        }

        //get the order details from the request body
        const { products, restaurant } = req.body;
        let totalPrice = 0;

        if(!restaurant || !products  || !Array.isArray(products)) {
            return res.status(400).json({ error: "restaurant and products are required" });
        }

        for(const product of products) {
            
            const productRestaurantId = product.restaurantID || product.restaurantId;
            const restaurantId = restaurant._id || restaurant.id;

            if(String(productRestaurantId) !== String(restaurantId)) {
                return res.status(400).json({ error: "All products must be from the same restaurant" });
            }
            totalPrice += product.price;
        }

        //create a new order object using the user ID from the user object
        
        const productIDs = products.map(p => p._id || p.id);
        const restaurantID = restaurant._id || restaurant.id; 

        const newOrder = new Order({
            userID: realUser._id,
            productsIDs: productIDs,
            restaurantID: restaurantID,
            totalPrice: totalPrice
        });

        //save the order to the data repository
        const savedOrder = await newOrder.save();
        realUser.orders.push(savedOrder._id);
        await realUser.save();

        // If there are products, send to the old server
        if (productIDs.length > 0) {
            sendCommand('patch', String(realUser._id), ...productIDs);     
        }

        //return the created order with 201(created) status
        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

//get all orders for the connected user
const getUserOrders = async (req, res) => {
    try {
        //get the user ID from the request
        const userId = req.user.id;

        //get the user's orders from the DB
        const userOrders = await userService.getUserOrders(userId);

        //return the orders
        res.status(200).json(userOrders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

//get a specific order by its ID
const getOrderById = async (req, res) => {
    try {
        const user = req.user;
        const id = req.params.id;

        //get the order from the DB
        const order = await Order.findById(id);

        //error if the order don't exist
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        if (String(order.userID) !== String(user.id)) {
            return res.status(403).json({ error: "no permission" });
        }
        
        //return the order details
        res.status(200).json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}; 

//delete order by its ID
const deleteOrder = async (req, res) => {
    try {
        //get the user object from the request
        const user = req.user;
        
        const realUser = await User.findById(user.id);
        if (!realUser) {
            return res.status(404).json({ error: "User not found" });
        }
        
        const id = req.params.id;
        const order = await Order.findById(id);
        
        if(!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        if (String(order.userID) !== String(user.id)) {
            return res.status(403).json({ error: "no permission" });
        }

        const productIds = order.productsIDs;

        if (productIds && productIds.length > 0) {      
            
            sendCommand('delete', String(realUser._id), ...productIds);        
        }
 
        //delete the order from the DB
        await Order.findByIdAndDelete(id);
        
        realUser.orders.pull(id);
        await realUser.save();
        
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

//update a specific order by the order ID
const updateOrder = async (req, res) => {
    try {
        //get the user object from the request
        const user = req.user;

        const id = req.params.id;

        //get the order from the data repository
        const order = await Order.findById(id);
        //error if the order don't exist
        if (!order)
             return res.status(404).json({ error: "Order not found" });

        
        if (String(order.userID) !== String(user.id)) {
            return res.status(403).json({ error: "no permission" });
        }

        const { products, restaurant } = req.body;

        if (!products && !restaurant) {
            return res.status(400).json({ error: "No data provided for update" });
        }
        
        
        const inputRestaurantId = restaurant ? (restaurant._id || restaurant.id) : null;
        const targetRestaurantId = inputRestaurantId ? inputRestaurantId : order.restaurantID;

        if (products !== undefined) {
            
            if (!Array.isArray(products)) {
                return res.status(400).json({ error: "products must be an array" });
            }

            let totalPrice = 0;
            
            for (const product of products) {
                
                const productRestId = product.restaurantID || product.restaurantId;

                if(String(productRestId) !== String(targetRestaurantId)) {
                    return res.status(400).json({ error: "All products must be from the order's restaurant" });
                }
                totalPrice += product.price;
            }
            

            order.productsIDs = products.map(p => p._id || p.id);
            order.totalPrice = totalPrice;

            // If there are products, send to the old server
            if (products.length > 0) {    
                const productIdsForTcp = products.map(product => String(product._id || product.id));
                sendCommand('patch', user.id, ...productIdsForTcp);     
            }
        }
   
        if (inputRestaurantId) {
            order.restaurantID = inputRestaurantId; 
        }

        await order.save();
        
        //return the updated order details
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrder,
    deleteOrder
};