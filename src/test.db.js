// Load environment variables from .env.
require("dotenv").config();

// Import our shared Prisma Client instance.
const prisma = require("./config/prisma");

async function testConnection() {
    try {
        // Establish a connection to PostgreSQL.
        await prisma.$connect();

        console.log("Successfully connected to Supabase PostgreSQL!");

        // Execute a simple SQL query to verify database connectivity.
        const result = await prisma.$queryRaw`SELECT 1`;

        console.log("Test query successful:", result);
    } catch (error) {
        console.error("Database connection failed:", error);
    } finally {
        // Close the connection after testing.
        await prisma.$disconnect();
    }
}

// Run the test.
testConnection();