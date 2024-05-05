const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticate = require("../middleware/authenticate");

// User registration
router.post("/register", userController.register);

// User session
router.get("/me", authenticate, userController.me);

// User login
router.post("/login", userController.login);

// Update user profile
router.put("/profile/:userId", authenticate, userController.updateProfile);

// Upload profile image (assuming Multer middleware is used)
router.post(
  "/profile/:userId/image",
  authenticate,
  userController.uploadProfileImage
);

// Request password reset
router.post("/forgot-password", userController.forgotPassword);

// Change password (after reset)
router.put("/change-password/:id", userController.changePassword);

module.exports = router;
