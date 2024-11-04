const mongoose = require("mongoose");

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log("Connected to the database!");
    } catch (error) {
        console.error("Database connection error:", error);
    }
};

// If you also want to export `db` for other files to use the connection
const db = mongoose.connection;
module.exports = { dbConnect, db };
