// Import validation functions from express-validator.
const { body } = require("express-validator");

// Validation rules for creating a project.
const createProjectValidator = [
    // Project name is required and cannot be blank.
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Project name is required"),

    // Description is optional, but if provided, it must be a string.
    body("description")
        .optional()
        .isString()
        .withMessage("Project description must be a string")
        .trim(),
];

// Validation rules for adding a member to a project.
const addProjectMemberValidator = [
    // Ensure the member's email is provided and valid.
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .bail()
        .isEmail()
        .withMessage("Please provide a valid email address"),
];

// Export validation rules.
module.exports = {
    createProjectValidator,
    addProjectMemberValidator
};