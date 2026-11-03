// Import Express.
const express = require("express");

// Import registration validation rules.
const { registerValidator, loginValidator } = require("../validators/auth.validator");

// Import validation middleware.
const validate = require("../middlewares/validate.middleware");

// import authController 
const authController = require("../controllers/auth.controller");

// Create an Express router.
const router = express.Router();

// Registration endpoint.
router.post("/register", registerValidator, validate, authController.register);

// login endpoint
router.post("/login", loginValidator, validate, authController.login);

// Export the router.
module.exports = router;