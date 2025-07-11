const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  defaultAddress: { type: String, required: true },
  governorate: { type: String, required: true },
  phoneNumbers: [{ type: String, unique: true, required: true }],
  addresses: [String],
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Client", clientSchema);
