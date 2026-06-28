const User = require('../Models/User');

const getUserById = async (id) => {
    
    return await User.findById(id); 
};

const register = async (userData) => {
    const user = new User(userData);
    return await user.save();
};

const isUsernameTaken = async (username) => {
    const user = await User.exists({ username });
    return user !== null;
};


const isMailTaken = async (mail) => {
    const user = await User.exists({ mail });
    return user!== null;
};

const getUserByDetails = async (username, password) => {
    return await User.findOne({ username, password });
};

const getUserOrders = async(userId) => {
   const user = await User.findById(userId).populate('orders');
    return user.orders;
};

module.exports = { 
    getUserById, 
    register, 
    isUsernameTaken, 
    isMailTaken, 
    getUserByDetails,
    getUserOrders
};