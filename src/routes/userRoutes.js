const express = require("express");
const {admin, user, admin_delete_user, admin_delete_login, logout} = require("../controller/userController")
const authenticate = require("../middlewares/authMiddleware")
const authorizeRoles = require("../middlewares/roleMiddleware")
const csrfProtection = require("../middlewares/csrfMiddleware")


const router = express.Router();

// Everyone can access this route
router.get("/user", authenticate, authorizeRoles("admin", "user"), csrfProtection, user)
// Only admin route
router.get("/admin", authenticate, authorizeRoles("admin"), csrfProtection, admin)
// Only admin delete user
router.delete("/admin/delete/user/:userId", authenticate, authorizeRoles("admin"), csrfProtection, admin_delete_user)
// Only admin delete login attempt
router.delete("/admin/delete/login/:attemptId", authenticate, authorizeRoles("admin"), csrfProtection, admin_delete_login)
// Logout route
router.post("/logout", authenticate, logout);


module.exports = router;
