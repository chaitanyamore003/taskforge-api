// Import jsonwebtoken for verifying JWT tokens.
const jwt = require("jsonwebtoken");

// Import custom application error class.
const AppError = require("../utils/AppError");

// Authentication middleware.
const authenticateUser = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Check the Bearer token format.
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError("Invalid or missing authentication token", 401);
        }

        const token = authHeader.split(" ")[1];

        // Verify the token.
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Attach decoded user information to the request.
        req.user = decoded;

        next();
    } catch (error) {
        // Forward application errors without changing them.
        if (error instanceof AppError) {
            return next(error);
        }

        // Convert JWT verification errors into authentication errors.
        return next(new AppError("Invalid or expired authentication token", 401));
    }
};

module.exports = authenticateUser;  