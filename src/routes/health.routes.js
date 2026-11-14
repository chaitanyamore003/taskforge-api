const express = require("express");
const authenticateUser = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "TaskForge API is running successfully"
    });
});


module.exports = router;