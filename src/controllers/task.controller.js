// Import task service.
const taskService = require("../services/task.service");

// Controller to create a new task.
const createTask = async (req, res) => {
    const {
        title,
        description,
        priority,
        status,
        dueDate,
        assigneeId,
    } = req.body;

    const task = await taskService.createTask({
        title,
        description,
        priority,
        status,
        dueDate,
        assigneeId,
        projectId: req.params.projectId,
        creatorId: req.user.id,
    });

    return res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: task,
    });
};

// Controller to retrieve tasks belonging to a project.
const getTasks = async (req, res) => {

    // Extract filtering, pagination, and sorting parameters.
    const {
        page,
        limit,
        status,
        priority,
        assigneeId,
        dueDate,
        sortBy,
        sortOrder,
    } = req.query;

    // Get project ID from URL parameters.
    const projectId = req.params.projectId;

    // Get authenticated user's ID.
    const userId = req.user.id;

    // Fetch tasks from the service layer.
    const result = await taskService.getTasks({
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
    });

    return res.status(200).json({
        success: true,
        message: "Tasks fetched successfully",
        data: result,
    });
};

// Controller to update an existing task.
const updateTask = async (req, res) => {
    // Extract the task ID from the URL parameters.
    const { taskId } = req.params;

    // Extract the authenticated user's ID from the JWT middleware.
    const userId = req.user.id;

    // Extract the updateable fields from the request body.
    const {
        title,
        description,
        status,
        priority,
        dueDate,
        assigneeId
    } = req.body;

    // Call the service layer to perform the update.
    const updatedTask = await taskService.updateTask({
        taskId,
        title,
        description,
        status,
        priority,
        dueDate,
        assigneeId,
        userId
    });

    // Return the updated task.
    return res.status(200).json({
        success: true,
        message: "Task updated successfully",
        data: updatedTask
    });
};

// Export task controller.
module.exports = {
    createTask,
    getTasks,
    updateTask
};