// Import Express and middleware packages.
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");

//local imports
const errorHandler = require("./middlewares/error.middleware");
const swaggerSpec = require("./config/swagger");

//routes
const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const projectRoutes = require("./routes/project.routes");
const taskRoutes = require("./routes/task.routes");


// Create an Express application.
const app = express();

// app.use(morgan('dev'));

// Configure CORS to allow requests from our frontend.
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

// Add security-related HTTP headers.
app.use(helmet());

// Parse incoming JSON request bodies.
app.use(express.json());

// Parse URL-encoded request bodies.
app.use(express.urlencoded({ extended: true }));

// API routes will be registered here.
app.use("/api", taskRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Handle requests that don't match any registered route.
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.originalUrl}`,
    });
});

// Centralized error-handling middleware (must be registered last).
app.use(errorHandler);

// Export the application.
module.exports = app;