const User = require("../models/userModel"); // Import the User model for database operations
const bcrypt = require("bcryptjs"); // Import bcrypt for password hashing
const jwt = require("jsonwebtoken"); // Import jsonwebtoken for JWT creation
const DOMPurify = require('dompurify'); // Import DOMPurify for sanitizing inputs
const { JSDOM } = require('jsdom'); // Import JSDOM to create a DOM for DOMPurify
const crypto = require("crypto"); // Import crypto for generating CSRF tokens

// Configure DOMPurify for use with Node.js
const window = new JSDOM('').window; // Create a new JSDOM instance
const purify = DOMPurify(window); // Initialize DOMPurify with the created window

// Landing page route controller
const landingpage = async (req, res) => {
    res.render('index'); // Render the landing page
};

// Register form render route
const register_form = (req, res) => {
    res.render('register'); // Render the registration form
};

// Register route controller
const register = async (req, res) => {
    console.log(req.body); // Log the body to inspect incoming data
    try {
        // Sanitize input fields individually
        const username = purify.sanitize(req.body.username);
        const password = purify.sanitize(req.body.password);
        const role = purify.sanitize(req.body.role);

        // Hash the password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create a new user instance and save to the database
        const newUser = new User({ username, password: hashedPassword, role });
        await newUser.save();
        
        res.redirect('/login'); // Redirect to the login page after successful registration
    } catch (error) {
        // Handle duplicate key error for username
        if (error.code === 11000 && error.keyPattern && error.keyPattern.username) {
            return res.redirect(`/error?status=400&message=${encodeURIComponent('Username already exists')}&redirectTo=/register`);
        }
        // Redirect to error page for other errors
        res.redirect(`/error?status=500&message=${encodeURIComponent(error.message)}&redirectTo=/register`);
    }
};

// Login form render route
const login_form = (req, res) => {
    res.render('login'); // Render the login form
};

// Login with JWT route controller
const login_token = async (req, res) => {
    try {
        // Sanitize input fields
        const username = purify.sanitize(req.body.username);
        const password = purify.sanitize(req.body.password);
        
        // Find the user in the database
        const user = await User.findOne({ username });
        if (!user) {
            return res.redirect(`/error?status=404&message=${encodeURIComponent('Username not found')}&redirectTo=/login`);
        }

        // Verify the password
        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) {
            return res.redirect(`/error?status=400&message=${encodeURIComponent('Invalid credentials')}&redirectTo=/login`);
        }

        // Reset login attempts upon successful login
        req.loginAttempt.attempts = 0;
        await req.loginAttempt.save();

        // Generate a JWT token for the user
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "3h" } // Set token expiration to 3 hours
        );

        // Generate a CSRF token
        const csrfToken = crypto.randomBytes(20).toString('hex');

        // Store the CSRF token in the user document
        user.csrfToken = csrfToken;
        await user.save();

        // Set cookie for CSRF token
        res.cookie('csrf_token', csrfToken, { httpOnly: false, secure: false, sameSite: 'Strict' });

        // Set response headers
        res.setHeader("Authorization", `Bearer ${token}`); // Set Authorization header with the JWT
        res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com");

        // Send the token as a JSON response
        res.json({ token });
    } catch (error) {
        // Redirect to error page for any errors
        res.redirect(`/error?status=500&message=${encodeURIComponent(error.message)}&redirectTo=/login`);
    }
};

// Login with cookie route controller
const login_cookie = async (req, res) => {
    try {
        // Sanitize input fields
        const username = purify.sanitize(req.body.username);
        const password = purify.sanitize(req.body.password);
        
        // Find the user in the database
        const user = await User.findOne({ username });
        if (!user) {
            return res.redirect(`/error?status=404&message=${encodeURIComponent('Username not found')}&redirectTo=/login`);
        }

        // Verify the password
        const isPassword = await bcrypt.compare(password, user.password);
        if (!isPassword) {
            return res.redirect(`/error?status=400&message=${encodeURIComponent('Invalid credentials')}&redirectTo=/login`);
        }

        // Reset login attempts upon successful login
        req.loginAttempt.attempts = 0;
        await req.loginAttempt.save();

        // Generate a JWT token for the user
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "3h" }
        );

        // Generate a CSRF token
        const csrfToken = crypto.randomBytes(20).toString('hex');
        
        // Set session cookie for the JWT
        res.setHeader('Set-Cookie', `session_token=${token}; HttpOnly; Path=/; Max-Age=3600; Secure; SameSite=Strict`);
        res.cookie('csrf_token', csrfToken, { httpOnly: false, secure: false, sameSite: 'Strict' });

        // Store the CSRF token in the user document
        user.csrfToken = csrfToken;
        await user.save();

        // Set response headers
        res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com");
        // Send the token as a JSON response
        res.json({ token });
    } catch (error) {
        // Redirect to error page for any errors
        res.redirect(`/error?status=500&message=${encodeURIComponent(error.message)}&redirectTo=/login`);
    }
};

// Error handling route
const error = async (req, res) => {
    const { status, message, redirectTo } = req.query; // Extract parameters from the query string
    res.render('error', { status, message, redirectTo }); // Render the error page with the provided information
}

// Export the route controllers for use in other files
module.exports = {
    landingpage,
    register_form,
    register,
    login_form,
    login_cookie,
    login_token,
    error
};
