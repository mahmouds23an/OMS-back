const express = require("express");
const { protect, role } = require("../middleware/authMiddleware");
const router = express.Router();
const clientController = require("../controllers/clientController");

router.get("/", protect, clientController.getAllClients);
router.get("/:id", protect, clientController.getClientById);
router.post("/", protect, role(["admin"]), clientController.createClient);
router.put("/:id", protect, role(["admin"]), clientController.updateClient);
router.delete("/:id", protect, role(["admin"]), clientController.deleteClient);

module.exports = router;
