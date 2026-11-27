// Import Express.
const express = require("express");

// Import registration validation rules.
const { registerValidator, loginValidator } = require("../validators/auth.validator");

// Import validation middleware.
const validate = require("../middlewares/validate.middleware");

// import authController 
const authController = require("../controllers/auth.controller");

// Create an Express router.
const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Validation error.
 *       409:
 *         description: Email already exists.
 */
router.post("/register", registerValidator, validate, authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login and receive JWT
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Login successful, returns token.
 *       401:
 *         description: Invalid credentials.
 */
router.post("/login", loginValidator, validate, authController.login);

// Export the router.
module.exports = router;