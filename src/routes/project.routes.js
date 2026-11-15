
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

// Route to create a project.
// 1. Authenticate the user.
// 2. Apply project creation validation rules.
// 3. Check whether validation passed.
// 4. Execute the project creation controller.
router.post(
    "/",
    authenticateUser,
    projectValidator.createProjectValidator,
    validate,
    projectController.createProject
);


// Route to retrieve all projects where the authenticated user is a member.
// Authentication is required before accessing the project controller.
router.get(
    "/",
    authenticateUser,
    projectController.getProjects
);

// Route to retrieve a specific project by its ID.
// Authentication is required before accessing the project.
router.get(
    "/:projectId",
    authenticateUser,
    projectController.getProjectById
);

// Route to add a new member to a project.
// Only authenticated users can access this endpoint.
// The service layer verifies that the requester owns the project.
router.post(
    "/:projectId/members",
    authenticateUser,
    projectValidator.addProjectMemberValidator,
    validate,
    projectController.addProjectMember
);

// Route to delete a project.
// The service ensures that only the project owner can delete it.
router.delete(
    "/:projectId",
    authenticateUser,
    projectController.deleteProject
);

// Route to get project task summary.
router.get(
    "/:projectId/summary",
    authenticateUser,
    projectController.getProjectSummary
);

// Export the router so it can be mounted in app.js.
module.exports = router;
