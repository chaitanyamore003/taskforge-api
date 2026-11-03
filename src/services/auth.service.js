const prisma = require("../config/prisma");

console.log("Auth service Prisma user delegate:", typeof prisma.user);

// Import custom application error class.
const AppError = require("../utils/AppError");

// Import bcrypt for securely hashing passwords.
const bcrypt = require("bcrypt");

// Registration service.
const registerUser = async (userData) => {
    // Normalize email to lowercase and remove surrounding whitespace.
    const email = userData.email.trim().toLowerCase();


    // Check whether a user with this email already exists.
    const existingUser = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });

    // If the email is already registered, throw a conflict error.
    if (existingUser) {
        throw new AppError("Email is already registered", 409);
    }

    // Hash the user's password using 12 salt rounds.
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    // Create a new user record in the database.
    const newUser = await prisma.user.create({
        data: {
            name: userData.name.trim(),
            email: email,
            passwordHash: hashedPassword,
        },
    });

    // Return only public user information.
    return {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
    };
};

// Export the registration service.
module.exports = {
    registerUser,
};