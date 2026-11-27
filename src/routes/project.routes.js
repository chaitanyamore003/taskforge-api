const express = require("express");

// Import project validation rules.
const projectValidator = require("../validators/project.validator");

// Import middleware to verify the user's JWT.
const authenticateUser = require("../middlewares/auth.middleware");

// Import the project controller containing request handlers.
const projectController = require("../controllers/project.controller");

// Import middleware to check the results of validation rules.
const validate = require("../middlewares/validate.middleware");

// Create an Express router to define project-related routes.
const router = express.Router();

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Website Redesign
 *               description:
 *                 type: string
 *                 example: Overhaul the company website
 *     responses:
 *       201:
 *         description: Project created successfully.
 *       401:
 *         description: Unauthorized.
 */
router.post(
    "/",
    authenticateUser,
    projectValidator.createProjectValidator,
    validate,
    projectController.createProject
);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects for the authenticated user
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of projects.
 *       401:
 *         description: Unauthorized.
 */
router.get(
    "/",
    authenticateUser,
    projectController.getProjects
);

/**
 * @swagger
 * /api/projects/{projectId}:
 *   get:
 *     summary: Get a specific project by ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project details.
 *       404:
 *         description: Project not found.
 */
router.get(
    "/:projectId",
    authenticateUser,
    projectController.getProjectById
);

/**
 * @swagger
 * /api/projects/{projectId}/members:
 *   post:
 *     summary: Add a member to a project
 *     tags: [Projects]
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
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: member@example.com
 *     responses:
 *       200:
 *         description: Member added successfully.
 *       403:
 *         description: Forbidden (Only the owner can add members).
 *       404:
 *         description: User or project not found.
 */
router.post(
    "/:projectId/members",
    authenticateUser,
    projectValidator.addProjectMemberValidator,
    validate,
    projectController.addProjectMember
);

/**
 * @swagger
 * /api/projects/{projectId}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project deleted successfully.
 *       403:
 *         description: Forbidden (Only the owner can delete).
 *       404:
 *         description: Project not found.
 */
router.delete(
    "/:projectId",
    authenticateUser,
    projectController.deleteProject
);

/**
 * @swagger
 * /api/projects/{projectId}/summary:
 *   get:
 *     summary: Get project task summary
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task counts by status and priority.
 *       404:
 *         description: Project not found or unauthorized.
 */
router.get(
    "/:projectId/summary",
    authenticateUser,
    projectController.getProjectSummary
);

// Export the router so it can be mounted in app.js.
module.exports = router;