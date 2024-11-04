const express = require("express");
const {landingpage, register_form, register,login_form, login_cookie, login_token,error} = require("../controller/authController")
const limitLoginAttempts = require("../middlewares/limitLoginAttempts");

const router = express.Router();

// Landing page route
router.get("/", landingpage);
// Renders register form route
router.get("/register", register_form);
// Register route logic for the database
router.post("/register", register);
// Login rendered form route
router.get("/login",login_form)
// Login logic for auth with cookie
router.post("/login_cookie",limitLoginAttempts, login_cookie);
// Login logic auth with jwt
router.post("/login_token", limitLoginAttempts, login_token);
// Generic erorr route
router.get("/error", error);

module.exports = router;
