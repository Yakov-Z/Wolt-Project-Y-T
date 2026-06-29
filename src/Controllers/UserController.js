const User = require('../Models/User');
const Address = require('../Models/address');
const userService = require('../Services/userService');
const mongoose = require('mongoose');
const { sendCommand } = require('../Services/tcpClient');
const jwt = require("jsonwebtoken");

// Use a single, consistent secret key definition across the app
const SECRET_KEY = process.env.JWT_SECRET || 'chikobyte-super-secret-key';

// get user by his ID, return the user profile
const getUserProfile = async (req, res) => {    
    const userId = req.params.id;

    // Bulletproof string comparison to avoid ObjectId vs String type mismatches
    if(String(req.user.id) !== String(userId)) {
        return res.status(403).json({ error: "You are not authorized to view this profile" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid user ID format" });
    }

    try {
        const user = await userService.getUserById(userId);

        // error if the user don't exist
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        // return the user profile without the password
        const usercheck = user.toObject();
        const { password: userPassword, ...userWithoutPassword } = usercheck;
        res.json(userWithoutPassword);
    } catch (err) {
        res.status(500).json({ error: "DB error" });
    }
};

// register a new user, return the created user profile
const registerUser = async (req, res) => {
    // get the user details from the request body
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
   
    // ensure the username is unique in the system
    if (username && !errors.username) {
        if (await userService.isUsernameTaken(username)) {
            errors.username = "Username is already taken";
        }
    }

    // ensure the mail is unique in the system
    if (mail && !errors.mail) {
        if (await userService.isMailTaken(mail)) {
            errors.mail = "Mail is already taken";
        }
    }

    // sent the errors to the client if there are any
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors }); 
    }

    try {
        const newUser = await userService.register({
            username,
            password,
            realname,
            phonenumber,
            mail,
            image,
            address,
            isadmin
        });

        const savedUser = newUser.toObject();
        // send the new user to old server by POST
        sendCommand('post', String(savedUser._id), -1);

        const token = jwt.sign(
            { id: savedUser._id, username: savedUser.username }, 
            SECRET_KEY, // Use the consistent secret
            { expiresIn: '1h' } 
        );

        const { password: userPassword, ...userWithoutPassword } = savedUser;
        res.status(201).json({ 
            user: userWithoutPassword, 
            token: token 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
};

// login user by his username and password
const loginUser = async (req, res) => {
    // get the username and password from the request body
    const { username, password } = req.body;
    
    try {
        const user = await userService.getUserByDetails(username, password);

        // error if the username or password is incorrect
        if (!user) {
            return res.status(401).json({ error: "username and/or password is incorrect" });
        }
        
        // create a JWT token for the user and return it
        const data = { id: user._id, username: user.username }; 
        const token = jwt.sign(
            data, 
            SECRET_KEY, // Use the consistent secret
            { expiresIn: '1h' } // Added expiration to match registration
        );
        
        // Remove the password before sending the user object back
        const userlogin = user.toObject();
        const { password: userPassword, ...userWithoutPassword } = userlogin;

        // Send both token and the user details to the client
        res.status(200).json({ 
            token: token,
            user: userWithoutPassword 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
};

module.exports = {
    getUserProfile,
    registerUser,
    loginUser
};