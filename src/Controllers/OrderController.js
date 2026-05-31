//connect to the data repository to get and manipulate order data
const dataRepository = require('../Models/DataRepository');
const Order = require('../Models/Order');
const { sendCommand } = require('../Services/tcpClient');

//create a new order for the connected user
const createOrder = (req, res) => {
    //get the user object from the request
    const user = req.user;

    //get the order details from the request body
    const { products, restaurant } = req.body;
    let totalPrice = 0;

    // check if products exist before iterating
    if (products && Array.isArray(products)) {
        for (const product of products) {
            totalPrice += product.price;
        }
    }

    //create a new order object using the user ID from the user object
    const newOrder = new Order(null, user.id, products, restaurant, totalPrice);

    //save the order to the data repository
    const savedOrder = dataRepository.addOrder(newOrder);
    user.orders.push(newOrder);

    // If there are products, send to the old server
    if (products && Array.isArray(products) && products.length > 0) {
        const productIds = products.map(product => product.id);
        sendCommand('post', user.id, ...productIds);     
    }

    //return the created order with 201(created) status
    res.status(201).json(savedOrder);
};

//get all orders for the connected user
const getUserOrders = (req, res) => {
    //get the user ID from the request
    const userId = req.user.id;

    //get the user's orders from the data repository
    const userOrders = dataRepository.getUserOrders(userId);

    //return the orders
    res.status(200).json(userOrders);
};

//get a specific order by its ID
const getOrderById = (req, res) => {
    // ID is int in our implementation, so we convert it from string to number
    const id = Number(req.params.id);

    //get the order from the data repository
    const order = dataRepository.getOrder(id);

    //error if the order don't exist
    if (!order) {
        return res.status(404).json({ error: "Order not found" });
    }

    //return the order details
    res.status(200).json(order);
};

//delete order by its ID
const deleteOrder = (req, res) => {
    //get the user object from the request
    const user = req.user;
    
    // ID is int in our implementation, so we convert it from string to number
    const id = Number(req.params.id);
    const order = dataRepository.getOrder(id);
    
    if(!order) {
        return res.status(404).json({ error: "Order not found" });
    }

    const products = order.products;

    if (products && products.length > 0) {      
        const productIds = products.map(product => product.id);
        sendCommand('delete', user.id, ...productIds);        
    }
 
    //delete the order from the data repository
    const isDeleted = dataRepository.deleteOrder(id);
    const newOrders = user.orders.filter(ord => ord !== order);
    user.orders = newOrders;
    
    //error if the order don't exist
    if (!isDeleted) {
        return res.status(404).json({ error: "Order not found" });
    }
    
    res.status(204).send();
};

//update a specific order by the order ID
const updateOrder = (req, res) => {
    //get the user object from the request
    const user = req.user;

    // ID is int in our implementation, so we convert it from string to number
    const id = Number(req.params.id);
    //get the order from the data repository
    const order = dataRepository.getOrder(id);
    //error if the order don't exist
    if (!order)
         return res.status(404).json({ error: "Order not found" });

    const { products, restaurant } = req.body;
    if (products && Array.isArray(products)) {
        let totalPrice = 0;
        for (const product of products) {
            totalPrice += product.price;
        }
        // update the order products that sent in the request body
        order.products = products;
        order.totalPrice = totalPrice;
        // If there are products, send to the old server
        if (products.length > 0) {    
            const productIds = products.map(product => product.id);
            sendCommand('patch', user.id, ...productIds);     
        }
        
    }

    // update the order restaurant that sent in the request body
    if (restaurant) order.restaurant = restaurant;
    
    //return the updated order details
    res.status(200).json(order);
};

module.exports = {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrder,
    deleteOrder
};