const express = require("express");
const authenticateUser = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check API health
 *     description: Returns a success message if the server is running.
 *     security: [] # <--- Add this to make it public (no lock icon)
 *     responses:
 *       200:
 *         description: Server is healthy.
 */
router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "TaskForge API is running successfully"
    });
});


module.exports = router;