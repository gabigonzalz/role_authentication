// Middleware to authorize users based on their roles
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // Check if the user's role is included in the allowed roles
        if (!allowedRoles.includes(req.user.role)) {
            // If not, respond with a 403 Forbidden status and a message
            return res.status(403).json({ message: "Access denied" });
        }
        // If the user is authorized, proceed to the next middleware or route handler
        next();
    };
};

module.exports = authorizeRoles; // Export the middleware for use in other parts of the application
