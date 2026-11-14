
// Import the shared Prisma Client instance.
const prisma = require("../config/prisma");

// Import our custom error class for handling application errors.
const AppError = require("../utils/AppError");

// Service function to create a new project.
const createProject = async (projectData, userId) => {

    // Start a database transaction to ensure both database operations succeed together.
    const project = await prisma.$transaction(async (tx) => {

        // Create a new project record in the Project table.
        const newProject = await tx.project.create({
            data: {
                name: projectData.name.trim(),
                description: projectData.description?.trim() || null,
                ownerId: userId,
            },
        });

        // Add the project creator to ProjectMember with the OWNER role.
        await tx.projectMember.create({
            data: {
                userId: userId,
                projectId: newProject.id,
                role: "OWNER",
            },
        });

        // Return the created project from the transaction.
        return newProject;
    });

    // Return only the project fields needed in the API response.
    return {
        id: project.id,
        name: project.name,
        description: project.description,
        ownerId: project.ownerId,
        createdAt: project.createdAt,
    };
};


// Service function to retrieve all projects related to the authenticated user.
const getProjects = async (userId) => {

    // Find all project memberships belonging to the authenticated user.
    const projects = await prisma.projectMember.findMany({
        where: {
            userId: userId,
        },

        // Include the associated project details.
        include: {
            project: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    ownerId: true,
                    createdAt: true,
                },
            },
        },
    });

    // Extract and return only the project objects from the membership records.
    return projects.map((projectMember) => projectMember.project);
};


// Service function to retrieve a specific project by its ID.
const getProjectById = async (projectId, userId) => {

    // Check whether the authenticated user is a member of this project.
    const membership = await prisma.projectMember.findUnique({
        where: {
            userId_projectId: {
                userId,
                projectId,
            },
        },
    });

    // Deny access if the user is not a project member.
    if (!membership) {
        throw new AppError("Project not found", 404);
    }

    // Fetch the project details from the database.
    const project = await prisma.project.findUnique({
        where: {
            id: projectId,
        },
        select: {
            id: true,
            name: true,
            description: true,
            ownerId: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    // Handle the case where the project does not exist.
    if (!project) {
        throw new AppError("Project not found", 404);
    }

    // Return the project details.
    return project;
};


// Service function to add a new member to a project.
const addProjectMember = async (projectId, userId, memberEmail) => {

    // Verify that the authenticated user owns the specified project.
    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            ownerId: userId,
        },
    });

    // Reject the request if the project doesn't exist or the user isn't its owner.
    if (!project) {
        throw new AppError("Project not found or you are not the owner", 404);
    }

    // Normalize the email address before searching for the member.
    const email = memberEmail.trim().toLowerCase();

    // Find the registered user who needs to be added.
    const member = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    // Reject the request if the email doesn't belong to a registered user.
    if (!member) {
        throw new AppError("Member is not registered", 404);
    }

    // Check whether this user is already a member of the specified project.
    const related = await prisma.projectMember.findUnique({
        where: {
            userId_projectId: {
                userId: member.id,
                projectId,
            },
        },
    });

    // Prevent duplicate project memberships.
    if (related) {
        throw new AppError("Member is already associated with this project", 409);
    }

    // Create a membership record with the MEMBER role.
    const memberAdded = await prisma.projectMember.create({
        data: {
            userId: member.id,
            projectId,
            role: "MEMBER",
        },
    });

    // Return the newly added member's details.
    return {
        userId: member.id,
        name: member.name,
        email: member.email,
        role: memberAdded.role,
    };
};

// service function to delete a project
const deleteProject = async (projectId, userId) => {

    //checking if user is owner of project or not
    // Verify that the specified project exists and belongs to the authenticated user.
    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            ownerId: userId,
        },
    });

    // Reject the request if the project doesn't exist or the user isn't its owner.
    if (!project) {
        throw new AppError("Project not found or you are not the owner", 404);
    }


    // Delete the project using its unique project ID.
    const deletedProject = await prisma.project.delete({
        where: {
            id: projectId,
        }
    });

    // Return the deleted project's basic details.
    return {
        id: deletedProject.id,
        name: deletedProject.name,
        ownerId: deletedProject.ownerId,
    };
}



// Export the service function for use in the controller.
module.exports = {
    createProject,
    getProjects,
    getProjectById,
    addProjectMember,
    deleteProject
};
