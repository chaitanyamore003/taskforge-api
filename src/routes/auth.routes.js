// Import Express.
const express = require("express");

// Import registration validation rules.
const { registerValidator } = require("../validators/auth.validator");

// Import validation middleware.
const validate = require("../middlewares/validate.middleware");

// import authController 
const authController = require("../controllers/auth.controller");

// Create an Express router.
const router = express.Router();

// Registration endpoint.
router.post("/register", registerValidator, validate, authController.register);

// Export the router.
module.exports = router;