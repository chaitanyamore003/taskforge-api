// Import validation functions from express-validator.
const { body, query } = require("express-validator");


// Validate the task title.
const createTaskValidator = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Task title is required"),
    // Validate the optional task description.
    body("description")
        .optional()
        .isString()
        .withMessage("Task description must be a string")
        .trim(),
    // Validate the optional task priority.
    body("priority")
        .optional()
        .isIn(["LOW", "MEDIUM", "HIGH"])
        .withMessage("Priority must be LOW, MEDIUM, or HIGH"),
    // Validate the optional task status.
    body("status")
        .optional()
        .isIn(["TODO", "IN_PROGRESS", "DONE"])
        .withMessage("Status must be TODO, IN_PROGRESS, or DONE"),
    // Validate the optional task due date.
    body("dueDate")
        .optional()
        .isISO8601()
        .withMessage("Due date must be a valid ISO 8601 date"),
    // Validate the optional task assignee ID.
    body("assigneeId")
        .optional()
        .isUUID()
        .withMessage("Assignee ID must be a valid UUID"),
];


const getTasksValidator = [
    // Validate the optional page query parameter.
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer")
        .toInt(),
    // Validate the optional limit query parameter.
    query("limit")
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage("Limit must be an integer between 1 and 50")
        .toInt(),
    // Validate the optional status query parameter.
    query("status")
        .optional()
        .isIn(["TODO", "IN_PROGRESS", "DONE"])
        .withMessage("Status must be TODO, IN_PROGRESS, or DONE"),
    // Validate the optional priority query parameter.
    query("priority")
        .optional()
        .isIn(["LOW", "MEDIUM", "HIGH"])
        .withMessage("Priority must be LOW, MEDIUM, or HIGH"),
    // Validate the optional assigneeId query parameter.
    query("assigneeId")
        .optional()
        .isUUID()
        .withMessage("Assignee ID must be a valid UUID"),
    // Validate the optional dueDate query parameter.
    query("dueDate")
        .optional()
        .isISO8601()
        .withMessage("Due date must be a valid ISO 8601 date"),
    // Validate the optional sortBy query parameter.
    query("sortBy")
        .optional()
        .isIn(["createdAt", "dueDate"])
        .withMessage("sortBy must be createdAt or dueDate"),
    // Validate the optional sortOrder query parameter.
    query("sortOrder")
        .optional()
        .isIn(["ASC", "DESC"])
        .withMessage("sortOrder must be ASC or DESC"),
];

const updateTaskValidator = [
    body("title")
        .optional()
        .isString()
        .withMessage("Title must be a string")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Title must not be empty"),

    body("description")
        .optional()
        .isString()
        .withMessage("Description must be a string"),

    body("status")
        .optional()
        .isIn(["TODO", "IN_PROGRESS", "DONE"])
        .withMessage("Invalid task status"),

    body("priority")
        .optional()
        .isIn(["LOW", "MEDIUM", "HIGH"])
        .withMessage("Invalid task priority"),

    // Validate the optional task due date.
    body("dueDate")
        .optional()
        .isISO8601()
        .withMessage("Due date must be a valid ISO 8601 date"),

    // Validate the optional task assignee ID.
    body("assigneeId")
        .optional()
        .isUUID()
        .withMessage("Assignee ID must be a valid UUID"),
];




module.exports = {
    createTaskValidator,
    getTasksValidator,
    updateTaskValidator
}