
const Order = require("../models/Order");
const Client = require("../models/Client");
const moment = require("moment");

exports.getOrders = async (req, res) => {
  const { status, search, from, to } = req.query;

  const query = {};
  if (status && status !== "all") query.status = status;
  if (search) query.trackId = { $regex: search, $options: "i" };
  if (from && to) {
    query.createdAt = {
      $gte: moment(from).startOf("day").toDate(),
      $lte: moment(to).endOf("day").toDate(),
    };
  }

  // Sort by newest first
  const orders = await Order.find(query)
    .populate("clientId")
    .sort({ createdAt: -1 });
  res.json(orders);
};

exports.getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate("clientId");
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
};

exports.createOrder = async (req, res) => {
  const { clientId, trackId, items, deliveryFees = 0, profit = 0, notes } = req.body;
  const total =
    items.reduce((sum, i) => sum + i.price * i.quantity, 0) + deliveryFees;

  // Auto-format track ID if provided and not already formatted
  let formattedTrackId = trackId || '';
  if (trackId && !trackId.startsWith('EB') && !trackId.endsWith('EG')) {
    const cleanId = trackId.replace(/^EB|EG$/g, '');
    formattedTrackId = `EB${cleanId}EG`;
  }

  const order = await Order.create({
    orderId: "ORD-" + Date.now(),
    clientId,
    trackId: formattedTrackId,
    items,
    deliveryFees,
    profit,
    total,
    notes,
    createdBy: req.user._id,
  });

  res.status(201).json(order);
};

exports.updateOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  const { status, notes, rating, items, deliveryFees, profit, trackId } = req.body;

  if (req.user.role === "admin") {
    if (items) {
      order.items = items;
      order.total =
        items.reduce((sum, i) => sum + i.price * i.quantity, 0) +
        (deliveryFees || 0);
    }
    order.deliveryFees = deliveryFees ?? order.deliveryFees;
    order.profit = profit ?? order.profit;
    
    // Auto-format track ID if provided
    if (trackId !== undefined) {
      if (trackId && !trackId.startsWith('EB') && !trackId.endsWith('EG')) {
        const cleanId = trackId.replace(/^EB|EG$/g, '');
        order.trackId = `EB${cleanId}EG`;
      } else {
        order.trackId = trackId;
      }
    }
  }

  order.status = status ?? order.status;
  order.notes = notes ?? order.notes;
  order.rating = rating ?? order.rating;
  order.updatedAt = Date.now();
  await order.save();

  // تحديث تقييم العميل
  if (rating && order.clientId) {
    const clientOrders = await Order.find({
      clientId: order.clientId,
      rating: { $gt: 0 },
    });
    const avg =
      clientOrders.reduce((acc, o) => acc + o.rating, 0) / clientOrders.length;
    await Client.findByIdAndUpdate(order.clientId, { rating: avg.toFixed(1) });
  }

  res.json(order);
};

exports.deleteOrder = async (req, res) => {
  const deletedOrder = await Order.findByIdAndDelete(req.params.id);
  if (!deletedOrder) {
    return res.status(404).json({ message: "Order not found" });
  }
  res.json({ message: "Order deleted" });
};
