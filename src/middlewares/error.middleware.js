// Middleware for handling all application errors centrally.
const errorHandler = (err, req, res, next) => {
    // Use the provided status code, or default to 500 (Internal Server Error).
    const statusCode = err.statusCode || 500;

    // Log unexpected errors for debugging.
    if (statusCode === 500) {
        console.error(err);
    }

    // Send a consistent JSON error response.
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};

// Export the middleware.
module.exports = errorHandler;