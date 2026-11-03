// Import the registration service.
const authService = require("../services/auth.service");

// Controller to handle user registration.
const register = async (req, res) => {
    // Pass registration details to the service.
    const user = await authService.registerUser(req.body);

    // Send a successful registration response.
    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user,
    });
};

// Controller to handle user login.
const login = async (req, res) => {
    // Pass login details to the service.
    const result = await authService.loginUser(req.body);

    // Send the JWT and user details to the client.
    res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
    });
};

// Export controller functions.
module.exports = {
    register,
    login
};