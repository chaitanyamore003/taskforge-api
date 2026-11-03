
// Import the project service containing project-related business logic.
const projectService = require("../services/project.service");

// Controller to handle project creation requests.
const createProject = async (req, res) => {

    // Get the authenticated user's ID from the JWT authentication middleware.
    const userId = req.user.id;

    // Call the service to create the project and its owner membership.
    const project = await projectService.createProject(req.body, userId);

    // Send a successful response with HTTP status code 201 (Created).
    res.status(201).json({
        success: true,
        message: "Project created successfully",
        data: project,
    });
};

// Controller to handle fetching projects belonging to the authenticated user.
const getProjects = async (req, res) => {

    // Extract the authenticated user's ID from the verified JWT payload.
    const userId = req.user.id;

    // Retrieve all projects where the authenticated user is a member.
    const projects = await projectService.getProjects(userId);

    // Send the retrieved projects with HTTP status code 200 (OK).
    res.status(200).json({
        success: true,
        message: "Projects fetched successfully",
        data: projects,
    });
};


// Controller to handle fetching a project using its ID.
const getProjectById = async (req, res) => {

    // Get the authenticated user's ID from the verified JWT.
    const userId = req.user.id;

    // Extract the project ID from the URL parameters.
    const projectId = req.params.projectId;

    // Call the service to verify membership and retrieve project details.
    const project = await projectService.getProjectById(projectId, userId);

    // Return the project details with HTTP status code 200 (OK).
    res.status(200).json({
        success: true,
        message: "Project fetched successfully",
        data: project,
    });
};


// Controller to handle adding a member to a project.
const addProjectMember = async (req, res) => {

    // Extract the project ID from the URL parameters.
    const projectId = req.params.projectId;

    // Get the email address of the user being added.
    const email = req.body.email;

    // Get the authenticated user's ID from the verified JWT.
    const userId = req.user.id;

    // Call the service to verify ownership and add the new member.
    const addMember = await projectService.addProjectMember(
        projectId,
        userId,
        email
    );

    // Return the newly added member's details.
    res.status(201).json({
        success: true,
        message: "Member added to project successfully",
        data: addMember,
    });
};


// Controller to handle project deletion requests.
const deleteProject = async (req, res) => {

    // Extract the project ID from the URL parameters.
    const projectId = req.params.projectId;

    // Get the authenticated user's ID from the verified JWT.
    const userId = req.user.id;

    // Call the service to verify ownership and delete the project.
    const deletedProject = await projectService.deleteProject(projectId, userId);

    // Return a successful response after deleting the project.
    res.status(200).json({
        success: true,
        message: "Project deleted successfully",
        data: {
            id: deletedProject.id,
            name: deletedProject.name,
        },
    });
};

// Export the controllers so they can be used in project routes.
module.exports = {
    createProject,
    getProjects,
    getProjectById,
    addProjectMember,
    deleteProject
};
