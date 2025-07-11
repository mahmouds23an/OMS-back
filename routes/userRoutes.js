const express = require("express");
const { protect, role } = require("../middleware/authMiddleware");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", protect, role(["admin"]), userController.getAllUsers);
router.post("/", protect, role(["admin"]), userController.createUser);
router.get("/:id", protect, role(["admin"]), userController.getUserById);
router.put("/:id", protect, role(["admin"]), userController.updateUser);
router.put(
  "/:id/role",
  protect,
  role(["admin"]),
  userController.updateUserRole
);
router.delete("/:id", protect, role(["admin"]), userController.deleteUser);

module.exports = router;
