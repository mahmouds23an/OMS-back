const express = require("express");
const { protect, role } = require("../middleware/authMiddleware");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");

router.get("/", protect, role(["admin"]), analyticsController.getAnalytics);

module.exports = router;
