const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Get the authorization header from the request
    const authHeader = req.headers['authorization'];
    
    // The header format is "Bearer <token>", so we split by space and take the second part
    const token = authHeader && authHeader.split(' ')[1];

    // If there is no token, return an unauthorized error
    if (!token) {
        return res.status(403).json({ error: "A token is required for authentication" });
    }

    try {
        // Verify the token using the environment variable, with a consistent fallback
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'chikobyte-super-secret-key');
        
        // Attach the decoded user data (like id and username) to the request object
        req.user = decoded;
        
        // Move to the next function (the actual controller)
        next();
    } catch (err) {
        // If the token is invalid or expired
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

module.exports = verifyToken;