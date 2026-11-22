const path = require("path");
const dotenv = require("dotenv");

// 1. Load environment variables FIRST
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// 2. Import Prisma
const prisma = require("../src/config/prisma");

// 3. Function to clean the database
const cleanDatabase = async () => {
    // Must delete in this order to satisfy Foreign Keys
    await prisma.task.deleteMany();
    await prisma.projectMember.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();
};

// Run cleanup before all tests start
beforeAll(async () => {
    await cleanDatabase();
});

// Run cleanup after all tests finish and disconnect Prisma
afterAll(async () => {
    await cleanDatabase();
    await prisma.$disconnect();
});