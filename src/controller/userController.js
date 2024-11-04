const User = require("../models/userModel");
const LoginAttempt = require("../models/loginAttemptModel");

// User route controller
const user = async (req, res) => {
    // Generic information to display on user page
    const userData = {
        username: 'TheJaneDoe', // Placeholder username
        name: 'Jane Doe', // Placeholder for user's name
        birth: '06/05/1979', // Placeholder for user's birthdate
        age: 45, // Placeholder for user's age
        phone: '(+123) 456-789', // Placeholder for user's phone number
        country: 'Argentina', // Placeholder for user's country
        passport: 'P<BAADOE<<JANE<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\n4433946959ARG7905067M2501017<<<<<<<<<<<<<<08', // Placeholder for user's passport details
        last_visit: 'France' // Placeholder for last visit location
    };
    
    res.render('user', userData); // Render user data on the user page
};

// Admin route controller
const admin = async (req, res) => {
    try {
        // Check if the user has admin privileges
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' }); // Deny access if not an admin
        }

        // Fetch all users from the database
        const users = await User.find({});
        // Fetch all login attempts from the database
        const loginAttempts = await LoginAttempt.find({});

        // Render admin page with users and login attempts data
        res.render('admin', { users, loginAttempts });
    } catch (error) {
        // Redirect to error page on failure
        res.redirect(`/error?status=500&message=${encodeURIComponent(error.message)}&redirectTo=/user`);
    }
};

// Admin delete user route controller
const admin_delete_user = async (req, res) => {
    try {
        // Get user ID from request parameters
        const { userId } = req.params; // Expecting userId as a URL parameter

        // Find and delete the user from the database
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' }); // Handle user not found
        }

        res.status(200).json({ message: 'User deleted successfully' }); // Success response
    } catch (err) {
        // Redirect to error page on failure
        res.redirect(`/error?status=500&message=${encodeURIComponent(err.message)}&redirectTo=/admin`);
    }
};

// Admin delete login attempt route controller
const admin_delete_login = async (req, res) => {
    try {
        // Get login attempt ID from request parameters
        const { attemptId } = req.params; // Expecting attemptId as a URL parameter

        // Find and delete the login attempt from the database
        const deletedAttempt = await LoginAttempt.findByIdAndDelete(attemptId);
        if (!deletedAttempt) {
            return res.status(404).json({ message: 'Login attempt not found' }); // Handle attempt not found
        }

        res.status(200).json({ message: 'Login attempt deleted successfully' }); // Success response
    } catch (err) {
        // Redirect to error page on failure
        res.redirect(`/error?status=500&message=${encodeURIComponent(err.message)}&redirectTo=/admin`);
    }
};

// Logout route controller (both JWT and cookie deletion)
const logout = async (req, res) => {
    try {
        // For the JWT token login:
        if (req.headers['authorization']) {
            // Clear the authorization header (this doesn't remove the token from client storage)
            res.setHeader("Authorization", "Bearer null");
        }

        // For the session cookie login:
        if (req.headers.session_token) {
            // Clear the session token cookie
            res.setHeader('Set-Cookie', 'session_token=; HttpOnly; Path=/; Max-Age=0; Secure; SameSite=Strict');
        }

        // Clear the CSRF token from both the database and cookie
        if (req.cookies.csrf_token) {
            const user = await User.findById(req.user.id);
            if (user) {
                user.csrfToken = null; // Clear CSRF token in the database
                await user.save(); // Save the user document
            }

            // Clear CSRF token cookie
            res.clearCookie('csrf_token', {
                httpOnly: false,
                secure: false,
                sameSite: 'Strict'
            });
        }

        // Send a response indicating logout was successful
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        // Redirect to error page on failure
        res.redirect(`/error?status=500&message=${encodeURIComponent(error.message)}&redirectTo=/`);
    }
};

// Export the routes for use in other parts of the application
module.exports = {
    admin,
    user,
    admin_delete_user,
    admin_delete_login,
    logout
};
