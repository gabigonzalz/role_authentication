const jwt = require("jsonwebtoken");

// Middleware to authenticate users based on JWT or session token
const authenticate = (req, res, next) => {
    // Check for JWT token in the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null; // Extract the token if present

    if (token) {
        // Verify the JWT token
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Invalid token" }); // Respond with an error if token is invalid
            }
            // Store the decoded user information in the request object for future use
            req.user = decoded;
            return next(); // Proceed to the next middleware or route handler
        });
    } else {
        // If no JWT token is found, check for the session token in cookies
        const sessionToken = req.cookies.session_token;

        if (!sessionToken) {
            return res.status(403).json({ message: "Access denied, token missing" }); // Respond with an error if no session token is found
        }

        // Verify the session token
        jwt.verify(sessionToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Invalid token" }); // Respond with an error if token is invalid
            }
            // Attach the decoded user information to req for later use
            req.user = decoded; // Store decoded user info in the request object
            next(); // Proceed to the next middleware or route handler
        });
    }
};

module.exports = authenticate; // Export the middleware for use in other parts of the application
