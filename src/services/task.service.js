
const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");

// Service to create a new task.
const createTask = async ({
    title,
    description,
    priority,
    status,
    dueDate,
    assigneeId,
    projectId,
    creatorId,
}) => {

    // Check whether the project exists.
    const project = await prisma.project.findUnique({
        where: {
            id: projectId,
        },
    });

    if (!project) {
        throw new AppError("Project does not exist", 404);
    }

    // Check whether the creator belongs to the project.
    const creatorRelated = await prisma.projectMember.findUnique({
        where: {
            userId_projectId: {
                userId: creatorId,
                projectId,
            },
        },
    });

    if (!creatorRelated) {
        throw new AppError("You are not a member of this project", 404);
    }

    // Check whether the assignee belongs to the project.
    if (assigneeId) {
        const assigneeRelated = await prisma.projectMember.findUnique({
            where: {
                userId_projectId: {
                    userId: assigneeId,
                    projectId,
                },
            },
        });

        if (!assigneeRelated) {
            throw new AppError("Assignee is not a member of this project", 404);
        }
    }

    // Create the task.
    const task = await prisma.task.create({
        data: {
            title,
            description: description || null,
            priority,
            status,
            dueDate: dueDate ? new Date(dueDate) : null,
            completedAt: status === "DONE" ? new Date() : null,
            projectId,
            creatorId,
            assigneeId: assigneeId || null,
        },
        select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            dueDate: true,
            completedAt: true,
            projectId: true,
            creatorId: true,
            assigneeId: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return task;
};

// Service to retrieve tasks belonging to a project.
const getTasks = async ({
    projectId,
    userId,
    page,
    limit,
    status,
    priority,
    assigneeId,
    dueDate,
    sortBy,
    sortOrder,
}) => {

    // Check whether the user belongs to the project.
    const membership = await prisma.projectMember.findUnique({
        where: {
            userId_projectId: {
                userId,
                projectId,
            },
        },
    });

    if (!membership) {
        throw new AppError("Project not found", 404);
    }

    // Set default pagination values.
    const currentPage = Number(page) || 1;
    const pageSize = Number(limit) || 10;

    // Calculate how many records to skip.
    const skip = (currentPage - 1) * pageSize;

    // Number of records to retrieve.
    const take = pageSize;

    // Build dynamic task filters.
    const where = {
        projectId,
    };

    // Apply status filter if provided.
    if (status) {
        where.status = status;
    }

    // Apply priority filter if provided.
    if (priority) {
        where.priority = priority;
    }

    // Apply assignee filter if provided.
    if (assigneeId) {
        where.assigneeId = assigneeId;
    }

    // Apply due date filter if provided.
    if (dueDate) {
        const startOfDay = new Date(`${dueDate}T00:00:00.000Z`);

        const endOfDay = new Date(`${dueDate}T23:59:59.999Z`);

        where.dueDate = {
            gte: startOfDay,
            lte: endOfDay,
        };
    }

    // Configure task sorting.
    const orderBy = [
        {
            [sortBy || "createdAt"]: (sortOrder || "DESC").toLowerCase(),
        },
        {
            id: "asc",
        },
    ];

    // Fetch tasks from the database.
    const tasks = await prisma.task.findMany({
        where,
        orderBy,
        skip,
        take,
        select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            dueDate: true,
            completedAt: true,
            projectId: true,
            creatorId: true,
            assigneeId: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    // Count tasks matching the applied filters.
    const totalTasks = await prisma.task.count({
        where,
    });

    // Calculate total number of pages.
    const totalPages = Math.ceil(totalTasks / pageSize);

    // Return tasks with pagination metadata.
    return {
        tasks,
        pagination: {
            totalTasks,
            totalPages,
            currentPage,
            pageSize,
            hasNextPage: currentPage < totalPages,
            hasPreviousPage: currentPage > 1,
        },
    };
};

// Service to update an existing task.
const updateTask = async ({
    taskId,
    title,
    description,
    status,
    priority,
    dueDate,
    assigneeId,
    userId
}) => {

    // 1. Find the existing task using its ID.
    const existingTask = await prisma.task.findUnique({
        where: {
            id: taskId
        }
    });

    // Return 404 if the task does not exist.
    if (!existingTask) {
        throw new AppError("Task not found", 404);
    }

    // 2. Verify that the requesting user belongs to the task's project.
    const membership = await prisma.projectMember.findUnique({
        where: {
            userId_projectId: {
                userId,
                projectId: existingTask.projectId
            }
        }
    });

    // Return 404 if the user is not a project member.
    if (!membership) {
        throw new AppError("Task not found", 404);
    }

    // 3. If a new assignee is provided, verify project membership.
    if (assigneeId !== undefined && assigneeId !== null) {
        const assigneeMembership = await prisma.projectMember.findUnique({
            where: {
                userId_projectId: {
                    userId: assigneeId,
                    projectId: existingTask.projectId
                }
            }
        });

        if (!assigneeMembership) {
            throw new AppError(
                "Assignee does not belong to this project",
                404
            );
        }
    }

    // 4. Build the update object using only supplied fields.
    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) {
        updateData.dueDate = dueDate ? new Date(dueDate) : null;
    }
    if (assigneeId !== undefined) {
        updateData.assigneeId = assigneeId;
    }

    // 5. Handle completedAt based on status transitions.
    if (status !== undefined) {
        updateData.status = status;

        if (status === "DONE" && existingTask.status !== "DONE") {
            updateData.completedAt = new Date();
        }
        else if (status !== "DONE") {
            updateData.completedAt = null;
        }
    }

    // 6. Update the task in the database.
    const updatedTask = await prisma.task.update({
        where: {
            id: taskId
        },
        data: updateData,
        select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            dueDate: true,
            completedAt: true,
            projectId: true,
            creatorId: true,
            assigneeId: true,
            createdAt: true,
            updatedAt: true
        }
    });

    return updatedTask;
};

// Service to delete a task.
const deleteTask = async ({ userId, taskId }) => {

    // Find the task using its unique ID.
    const existingTask = await prisma.task.findUnique({
        where: {
            id: taskId
        }
    });

    if (!existingTask) {
        throw new AppError("Task not found", 404);
    }

    // Check whether the requesting user created the task.
    const isCreator = existingTask.creatorId === userId;

    // Check whether the requesting user owns the project.
    const isProjectOwner = await prisma.project.findFirst({
        where: {
            id: existingTask.projectId,
            ownerId: userId
        }
    });

    // Only the creator or project owner can delete the task.
    if (!isCreator && !isProjectOwner) {
        throw new AppError(
            "You are not authorized to delete this task",
            403
        );
    }

    // Delete the task from the database.
    const taskDeleted = await prisma.task.delete({
        where: {
            id: taskId
        }
    });

    return taskDeleted;
};

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask
};
