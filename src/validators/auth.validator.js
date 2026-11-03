// Import validation functions from express-validator.
const { body } = require("express-validator");

// Validation rules for user registration.
const registerValidator = [
    // Name must be provided and cannot be blank.
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required"),

    // Email must be provided and follow a valid email format.
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .bail()
        .isEmail()
        .withMessage("Please provide a valid email address"),

    // Password must contain at least 8 characters.
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .bail()
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long"),
];

// validation rules for user login
const loginValidator = [
    // email must be provided and must be a valid email format
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .bail()
        .isEmail()
        .withMessage("Please provide a valid email address"),

    // password must be provided and cannot be blank
    body("password")
        .notEmpty()
        .withMessage("Password is required"),
]

// Export the validation rules.
module.exports = {
    registerValidator,
    loginValidator,

};