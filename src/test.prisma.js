require("dotenv").config();

const prisma = require("./config/prisma");

const testPrisma = async () => {
    try {
        const users = await prisma.user.findMany();

        console.log("User query successful:", users);
    } catch (error) {
        console.error("Database query failed:", error);
    } finally {
        await prisma.$disconnect();
    }
};

testPrisma();