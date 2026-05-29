//connect to the data repository to get and manipulate order data
const dataRepository = require('../Models/DataRepository');
const Order = require('../Models/Order');
const { sendCommand } = require('../Services/tcpClient');

//create a new order for the connected user
const createOrder = (req, res) => {
    //get the user ID from the headers
    const userIdHeader = req.headers['userid'];

    //error if the user is not connected
    if (!userIdHeader) {
        return res.json({ error: "User is not connected" });
    }
    //convert the user ID from string to number
    const userId = Number(userIdHeader);

    //get the order details from the request body
    const { products, restaurant, totalPrice } = req.body;

    //create a new order object using the user ID from the header
    const newOrder = new Order(null, userId, products, restaurant, totalPrice);

    //save the order to the data repository
    const savedOrder = dataRepository.addOrder(newOrder);

    // If there are products, send to the old server
    if (products && Array.isArray(products) && products.length > 0) {
        sendCommand('post', userId, ...products);       
    }

    //return the created order
    res.json(savedOrder);
};

//get all orders for the connected user
const getUserOrders = (req, res) => {
    //get the user ID from the headers
    const userIdHeader = req.headers['userid'];

    //error if the user is not connected
    if (!userIdHeader) {
        return res.json({ error: "User is not connected" });
    }
    //convert the user ID from string to number
    const userId = Number(userIdHeader);

    //get the user's orders from the data repository
    const userOrders = dataRepository.getUserOrders(userId);

    //return the orders
    res.json(userOrders);
};

//get a specific order by its ID
const getOrderById = (req, res) => {
    // ID is int in our implementation, so we convert it from string to number
    const id = Number(req.params.id);

    //get the order from the data repository
    const order = dataRepository.getOrder(id);

    //error if the order don't exist
    if (!order) {
        return res.json({ error: "Order not found" });
    }

    //return the order details
    res.json(order);
};

//delete order by its ID
const deleteOrder = (req, res) => {
    // ID is int in our implementation, so we convert it from string to number
    const id = Number(req.params.id);
    //get the user ID from the headers
    const userIdHeader = req.headers['userid'];

    //error if the user is not connected
    if (!userIdHeader) {
        return res.json({ error: "User is not connected" });
    }
    //convert the user ID from string to number
    const userId = Number(userIdHeader);
    const order = dataRepository.getOrder(id);
    
    if(!order) {
        return res.json({ error: "Order not found" });
    }
    const products = order.products;

    if (products.length > 0) {        
        sendCommand('delete', userId, ...products);       
    }
    //delete the order from the data repository
    const isDeleted = dataRepository.deleteOrder(id); 
    
    //error if the order don't exist
    if (!isDeleted) {
        return res.json({ error: "Order not found" });
    }
    
    res.json({});
};

//update a specific order by the order ID
const updateOrder = (req, res) => {
    // ID is int in our implementation, so we convert it from string to number
    const id = Number(req.params.id);
    //get the order from the data repository
    const order = dataRepository.getOrder(id);
    //error if the order don't exist
    if (!order)
         return res.json({ error: "Order not found" });
        //get the user ID from the headers
    const userIdHeader = req.headers['userid'];

    //error if the user is not connected
    if (!userIdHeader) {
        return res.json({ error: "User is not connected" });
    }
    //convert the user ID from string to number
    const userId = Number(userIdHeader);

    const { products, restaurant, totalPrice } = req.body;
    
    // If there are products, send to the old server
    if (products.length > 0) {        
        sendCommand('patch', userId, ...products);       
    }

    // update the order details that sent in the request body
    if (products) order.products = products;
    if (restaurant) order.restaurant = restaurant;
    if (totalPrice) order.totalPrice = totalPrice;
    
    //return the updated order details
    res.json(order);
};

module.exports = {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrder,
    deleteOrder
};