
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true, AutoIncrement: true },
  trackId: { type: String, default: "" },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
  items: [
    {
      name: String,
      quantity: Number,
      price: Number,
      size: String,
    },
  ],
  deliveryFees: { type: Number, default: 0 },
  profit: { type: Number, default: 0 },
  total: Number,
  status: {
    type: String,
    enum: ["pending", "shipped", "delivered", "cancelled", "returned"],
    default: "pending",
  },
  notes: String,
  rating: Number,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
