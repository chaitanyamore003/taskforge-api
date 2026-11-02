// Import Prisma Client from the generated @prisma/client package.
const { PrismaClient } = require("@prisma/client");

// Import the PostgreSQL driver adapter required by Prisma 7.
const { PrismaPg } = require("@prisma/adapter-pg");

// Create the PostgreSQL adapter using our database connection URL.
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

// Initialize Prisma Client with the PostgreSQL adapter.
const prisma = new PrismaClient({
    adapter,
});

// Export the instance so other files can reuse it.
module.exports = prisma;