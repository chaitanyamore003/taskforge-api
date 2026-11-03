// Custom error class for handling application-specific errors.
class AppError extends Error {
    constructor(message, statusCode) {

        // Pass the error message to the built-in Error class.
        super(message);

        // Store the HTTP status code.
        this.statusCode = statusCode;

        // Distinguish operational errors from unexpected errors.
        this.isOperational = true;

        // Capture the correct stack trace for debugging.
        Error.captureStackTrace(this, this.constructor);
    }
}

// Export the custom error class.
module.exports = AppError;