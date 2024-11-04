const express = require("express");
const path = require('path');
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();
const {dbConnect} = require("./config/dbConnect");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

// Define the app
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
// Middleware to parse URL-encoded data (from forms)
app.use(express.urlencoded({ extended: true }));


// Connect to db
dbConnect();

// Routes' prefixes
app.use(authRoutes);
app.use(userRoutes);

/// Set the views directory and the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Start the server
const PORT = process.env.PORT || 7002;
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`); 
});
