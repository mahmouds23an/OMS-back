
const Client = require("../models/Client");

exports.getAllClients = async (req, res) => {
  const clients = await Client.find();
  res.json(clients);
};

exports.getClientById = async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (!client) return res.status(404).json({ message: "Client not found" });
  res.json(client);
};

exports.createClient = async (req, res) => {
  try {
    // Check if name already exists
    const existingNameClient = await Client.findOne({ name: req.body.name });
    if (existingNameClient) {
      return res.status(400).json({ message: "Client name already exists" });
    }

    // Check if any phone number already exists
    if (req.body.phoneNumbers && req.body.phoneNumbers.length > 0) {
      const existingPhoneClient = await Client.findOne({ 
        phoneNumbers: { $in: req.body.phoneNumbers } 
      });
      if (existingPhoneClient) {
        return res.status(400).json({ message: "Phone number already exists" });
      }
    }

    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern.name) {
        return res.status(400).json({ message: "Client name already exists" });
      }
      if (error.keyPattern.phoneNumbers) {
        return res.status(400).json({ message: "Phone number already exists" });
      }
    }
    res.status(500).json({ message: error.message });
  }
};

exports.updateClient = async (req, res) => {
  try {
    // Check if name already exists (excluding current client)
    if (req.body.name) {
      const existingNameClient = await Client.findOne({ 
        name: req.body.name,
        _id: { $ne: req.params.id }
      });
      if (existingNameClient) {
        return res.status(400).json({ message: "Client name already exists" });
      }
    }

    // Check if any phone number already exists (excluding current client)
    if (req.body.phoneNumbers && req.body.phoneNumbers.length > 0) {
      const existingPhoneClient = await Client.findOne({ 
        phoneNumbers: { $in: req.body.phoneNumbers },
        _id: { $ne: req.params.id }
      });
      if (existingPhoneClient) {
        return res.status(400).json({ message: "Phone number already exists" });
      }
    }

    const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(client);
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern.name) {
        return res.status(400).json({ message: "Client name already exists" });
      }
      if (error.keyPattern.phoneNumbers) {
        return res.status(400).json({ message: "Phone number already exists" });
      }
    }
    res.status(500).json({ message: error.message });
  }
};

exports.deleteClient = async (req, res) => {
  await Client.findByIdAndDelete(req.params.id);
  res.json({ message: "Client deleted" });
};
