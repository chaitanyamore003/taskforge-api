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

// Export controller functions.
module.exports = {
    register,
};