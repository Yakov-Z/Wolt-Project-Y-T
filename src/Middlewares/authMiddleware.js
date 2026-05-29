const dataRepository = require('../Models/DataRepository');

// middleware to verify the user exists and is connected
const requireAuth = (req, res, next) => {
    // get the user ID from the headers
    const userIdHeader = req.headers['userid'];

    // error if the user is not connected
    if (!userIdHeader) {
        return res.status(401).json({ error: "Unauthorized: User is not connected" });
    }

    // convert the user ID from string to number and fetch user
    const userId = Number(userIdHeader);
    const user = dataRepository.getUser(userId);

    // error if the user don't exist in the system
    if (!user) {
        return res.status(404).json({ error: "User not found in system" });
    }

    // attach the user object to the request so controllers can use it easily
    req.user = user;
    
    // pass control to the next middleware or controller
    next();
};

module.exports = requireAuth;