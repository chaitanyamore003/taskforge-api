// Import Express to create the task router.
const express = require("express");

// Import task validation rules.
const taskValidator = require("../validators/task.validator");

// Import validation middleware.
const validate = require("../middlewares/validate.middleware");

// Import authentication middleware.
const authenticateUser = require("../middlewares/auth.middleware");

// Import task controller.
const taskController = require("../controllers/task.controller");

// Create an Express router.
const router = express.Router();

router.post(
    "/projects/:projectId/tasks",
    authenticateUser,
    taskValidator.createTaskValidator,
    validate,
    taskController.createTask
);

// Get all tasks belonging to a project.
router.get(
    "/projects/:projectId/tasks",
    authenticateUser,
    taskValidator.getTasksValidator,
    validate,
    taskController.getTasks
);

// Route to update an existing task.
router.patch(
    "/tasks/:taskId",
    authenticateUser,
    taskValidator.updateTaskValidator,
    validate,
    taskController.updateTask
);


// Route to delete a task
router.delete("/tasks/:taskId", authenticateUser, taskController.deleteTask);




module.exports = router;
