const User = require('../models/userModel');

// Middleware to check CSRF Token
const csrfProtection = async (req, res, next) => {
    // Get the CSRF token from the cookie
    const csrfToken = req.cookies.csrf_token; // Assuming you're using a cookie named csrf_token
    const userId = req.user.id; // Get user ID from authenticated request
    // Check if the CSRF token is missing
    if (!csrfToken) {
        return res.status(403).json({ message: "CSRF token missing" });
    }

    // Retrieve the user from the database
    const user = await User.findById(userId);
    if (!user || user.csrfToken !== csrfToken) {
        return res.status(403).json({ message: "Invalid CSRF token" });
    }

    next(); // Continue if the token is valid
};

module.exports = csrfProtection;
