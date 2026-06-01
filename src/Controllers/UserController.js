//connect to the data repository to get and manipulate user data
const dataRepository = require('../Models/DataRepository');
const User = require('../Models/User');
const { sendCommand } = require('../Services/tcpClient');

//get user by his ID, return the user profile
const getUserProfile = (req, res) => {
    // ID is int in our implementation, so we convert it from string to number
    const userId = Number(req.params.id);
    const user = dataRepository.getUser(userId);

    //error if the user don't exist
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
   //return the user profile
    res.json(user);
};

//register a new user, return the created user profile
const registerUser = (req, res) => {
    //get the user details from the request body
    const { username, password, address } = req.body;

    //error if username or password is null
    if (!username || !password || !address) {
        return res.status(400).json({ error: "Username ,password and address are required" });
    }

    //create and save the new user to the data repository
    const newUser = new User(null, username, password, address);
    const savedUser = dataRepository.addUser(newUser);
    // send the new user to old server by POST
    sendCommand('post', savedUser.id, -1);
    res.status(201).json(savedUser);

};

//login user by his username and password
const loginUser = (req, res) => {
    
    //get the username and password from the request body
    const { username, password } = req.body;
    //check if the username and password are correct
    const user = dataRepository.getUserByDetails(username, password);

    //error if the username or password is incorrect
    if (!user) {
        return res.status(401).json({ error: "username or password is incorrect" });
    }

    res.json(user);
};

//export the controller functions to be used in the routes
module.exports = {
    getUserProfile,
    registerUser,
    loginUser
};