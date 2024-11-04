const mongoose = require("mongoose");

const loginAttemptSchema = new mongoose.Schema({
    username: String,
    attempts: { type: Number, default: 0 },
    lastAttempt: { type: Date, default: Date.now },
    lockedUntil: Date,
});

const LoginAttempt = mongoose.model("LoginAttempt", loginAttemptSchema);
module.exports = LoginAttempt;
