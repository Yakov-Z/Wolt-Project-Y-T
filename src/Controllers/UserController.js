//connect to the data repository to get and manipulate user data
const dataRepository = require('../Models/DataRepository');
const User = require('../Models/User');
const Address = require('../Models/address');
const { sendCommand } = require('../Services/tcpClient');
const jwt = require("jsonwebtoken");
const key = "like in targilon 8";

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
   // res.json(user);
     const { password: userPassword, ...userWithoutPassword } = user;
     res.json(userWithoutPassword);
};



//register a new user, return the created user profile
const registerUser = (req, res) => {
    //get the user details from the request body
    const { username, password, realname, phonenumber, mail, image, address, isadmin } = req.body;

    // we will save the errors and sent them to the client if there are any
    let errors = {};

    if (!username) errors.username = "Username is required";
    if (!password) {
        errors.password = "Password is required";
    } else if (password.length < 8) {
    errors.password = "The password must contain at least 8 characters";
} else {
    
    const chars = password.split('');

    // search for letters and numbers in the password
    const hasLetter = chars.some(c => (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z'));
    const hasNumber = chars.some(c => c >= '0' && c <= '9');

    if (!hasLetter && !hasNumber) {
        errors.password = "The password must include both letters and numbers";
    } else if (!hasLetter) {
        errors.password = "The password must include at least one English letter";
    } else if (!hasNumber) {
        errors.password = "The password must include at least one number";
    }
}
    if (!realname) errors.realname = "Full name is required";
    if (!phonenumber) errors.phonenumber = "Phone number is required";
    if (!mail) errors.mail = "Mail is required";
    if (!image) errors.image = "Image is required";
    if (!address || !address.city || !address.street || !address.number || !address.latitude || !address.longitude){
        errors.address = "Full address is required";
    }
    if(isadmin == null || isadmin == undefined) {
        errors.isadmin = "status is required";
    }

    // ensure the username is unique in the system
    if (username && !errors.username) {
        const isUsernameexist = Array.from(dataRepository.users.values()).some(u => u.username === username);
        if (isUsernameexist) {
            errors.username = "Username is already taken";
        }
    }


    // sent the errors to the client if there are any
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors }); 
    }

    // create the user'a address object
    const userAddress = new Address(address.city, address.street, address.number, address.latitude, address.longitude);
    //create and save the new user to the data repository
    const newUser = new User(null, username, password, realname, phonenumber, mail, image, userAddress, isadmin);

    const savedUser = dataRepository.addUser(newUser);
    // send the new user to old server by POST
    sendCommand('post', savedUser.id, -1);

    const token = jwt.sign(
        { id: savedUser.id, username: savedUser.username }, // payload: data encoded in the token
        process.env.JWT_SECRET || 'מפתח-סופר-סודי', // secret key used to sign the token
        { expiresIn: '1h' } // token expiration time
    );

    const { password: userPassword, ...userWithoutPassword } = savedUser;
    res.status(201).json({ 
        user: userWithoutPassword, 
        token: token 
    });
};


//login user by his username and password
const loginUser = (req, res) => {
    
    //get the username and password from the request body
    const { username, password } = req.body;
    //check if the username and password are correct
    const user = dataRepository.getUserByDetails(username, password);

    //error if the username or password is incorrect
    if (!user) {
        return res.status(401).json({ error: "username and/or password is incorrect" });
    }
    //create a JWT token for the user and return it
    const data = { id: user.id, username: user.username }; 
    const token = jwt.sign(data, process.env.JWT_SECRET || 'מפתח-סופר-סודי');
// Remove the password before sending the user object back
    const { password: userPassword, ...userWithoutPassword } = user;

    // Send both token and the user details to the client
    res.status(200).json({ 
        token: token,
        user: userWithoutPassword 
    });
};

//export the controller functions to be used in the routes
module.exports = {
    getUserProfile,
    registerUser,
    loginUser
};