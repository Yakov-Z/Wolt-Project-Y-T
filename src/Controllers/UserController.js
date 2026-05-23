//connect to the data repository to get and manipulate user data
const dataRepository = require('../Models/DataRepository');
const User = require('../Models/User');

//get user by his ID, return the user profile
const getUserProfile = (req, res) => {
    // ID is int in our implementation, so we convert it from string to number
    const userId = Number(req.params.id);
    const user = dataRepository.getUser(userId);

    //error if the userr don't exist
    if (!user) {
        return res.json({ error: "User not found" });
    }
   //return the user profile
    res.json(user);
};

//register a new user, return the created user profile
const registerUser = (req, res) => {
    //get the user details from the request body
    const { username, password, address } = req.body;

    //error if username or password is null
    if (!username || !password) {
        return res.json({ error: "Username and password are required" });
    }

    //create and save the new user to the data repository
    const newUser = new User(null, username, password, address);
    const savedUser = dataRepository.addUser(newUser);
    res.json(savedUser);

};

//login user by his username and password
const loginUser = (req, res) => {
    
    //get the username and password from the request body
    const { username, password } = req.body;
    //check if the username and password are correct
    const user = dataRepository.getUserByDetails(username, password);

    //error if the username or password is incorrect
    if (!user) {
        return res.json({ error: "username or password is incorrect" });
    }

    res.json(user);
};

//export the controller functions to be used in the routes
module.exports = {
    getUserProfile,
    registerUser,
    loginUser
};