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

/**
 * @swagger
 * /api/projects/{projectId}/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Write API documentation
 *               description:
 *                 type: string
 *                 example: Use Swagger to document the endpoints
 *               status:
 *                 type: string
 *                 enum: [TODO, IN_PROGRESS, DONE]
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               assigneeId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created successfully.
 *       400:
 *         description: Invalid input or assignee not in project.
 */
router.post(
    "/projects/:projectId/tasks",
    authenticateUser,
    taskValidator.createTaskValidator,
    validate,
    taskController.createTask
);

/**
 * @swagger
 * /api/projects/{projectId}/tasks:
 *   get:
 *     summary: Get tasks for a project
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [TODO, IN_PROGRESS, DONE]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH]
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, dueDate]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *     responses:
 *       200:
 *         description: List of tasks retrieved.
 */
router.get(
    "/projects/:projectId/tasks",
    authenticateUser,
    taskValidator.getTasksValidator,
    validate,
    taskController.getTasks
);

/**
 * @swagger
 * /api/tasks/{taskId}:
 *   patch:
 *     summary: Update a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [TODO, IN_PROGRESS, DONE]
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               assigneeId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated successfully.
 *       403:
 *         description: Forbidden (Not a project member).
 *       404:
 *         description: Task not found.
 */
router.patch(
    "/tasks/:taskId",
    authenticateUser,
    taskValidator.updateTaskValidator,
    validate,
    taskController.updateTask
);


/**
 * @swagger
 * /api/tasks/{taskId}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     description: Only the task creator or the project owner can delete the task.
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully.
 *       403:
 *         description: Forbidden (You are not authorized to delete this task).
 *       404:
 *         description: Task not found.
 */
router.delete("/tasks/:taskId", authenticateUser, taskController.deleteTask);




module.exports = router;
