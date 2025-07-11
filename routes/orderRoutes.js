const express = require("express");
const { protect, role } = require("../middleware/authMiddleware");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.get("/", protect, orderController.getOrders);
router.get("/:id", protect, orderController.getOrderById);
router.post("/", protect, role(["admin"]), orderController.createOrder);
router.put("/:id", protect, orderController.updateOrder);
router.delete("/:id", protect, role(["admin"]), orderController.deleteOrder);

module.exports = router;
