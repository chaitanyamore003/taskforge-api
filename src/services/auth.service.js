const prisma = require("../config/prisma");

// Import custom application error class.
const AppError = require("../utils/AppError");

// Import bcrypt for securely hashing passwords.
const bcrypt = require("bcrypt");

// import json web token for token service
const jwt = require("jsonwebtoken");

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

// login service
const loginUser = async (userData) => {
    const email = userData.email.trim().toLowerCase();
    const password = userData.password;


    //checking user
    const user = await prisma.user.findUnique({
        where: {
            email,
        }
    })

    //if user not found return error
    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }

    //camparing the passwords
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    //if passwords don't match return error
    if (!passwordMatch) {
        throw new AppError("Invalid email or password", 401);
    }

    //generating jwt token
    // Generate a JWT for the authenticated user.
    const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Return the token and safe user information.
    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    };
}

// Export the registration service.
module.exports = {
    registerUser,
    loginUser,
};