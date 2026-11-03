// Load environment variables from .env.
require("dotenv").config();

// Import the configured Express application.
const app = require("./app");

// Read the port from environment variables.
const PORT = process.env.PORT || 3000;

// Start the HTTP server.
app.listen(PORT, () => {
    console.log(`TaskForge server running on port ${PORT}`);
});