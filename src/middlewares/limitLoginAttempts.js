const LoginAttempt = require("../models/loginAttemptModel");

// Middleware to limit the amount of login tries
const limitLoginAttempts = async (req, res, next) => {
    const { username } = req.body;
    
    // Search for the data of the user
    let loginAttempt = await LoginAttempt.findOne({ username });

    if (loginAttempt) {
        const now = new Date();

        // Verify if the user is blocked
        if (loginAttempt.lockedUntil && now < loginAttempt.lockedUntil) {
            const remainingTime = Math.ceil((loginAttempt.lockedUntil - now) / 1000);
            return res.status(403).json({ message: `Account locked. Try again in ${remainingTime} seconds.` });
        }

        // Reset tries if the limit of time has passed
        if (now - loginAttempt.lastAttempt > 15 * 60 * 1000) { // 15 minutos
            loginAttempt.attempts = 0;
        }
    } else {
        // Create a new input of data if it doesnt exist
        loginAttempt = new LoginAttempt({ username });
    }

    req.loginAttempt = loginAttempt; // Create a loginAttempt object to use in the route
    next();
};

module.exports = limitLoginAttempts;
