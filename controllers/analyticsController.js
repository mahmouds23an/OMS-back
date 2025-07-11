
const Order = require("../models/Order");
const moment = require("moment");

exports.getAnalytics = async (req, res) => {
  const { from, to } = req.query;
  const start = from
    ? moment(from).startOf("day").toDate()
    : moment().startOf("month").toDate();
  const end = to
    ? moment(to).endOf("day").toDate()
    : moment().endOf("day").toDate();

  const orders = await Order.find({ createdAt: { $gte: start, $lte: end } });

  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const returnedOrders = orders.filter((o) => o.status === "returned").length;
  const shippedOrders = orders.filter((o) => o.status === "shipped").length;
  const cancelledOrders = orders.filter((o) => o.status === "cancelled").length;
  
  const totalRevenue = orders
    .filter((o) => o.status === "delivered")
    .reduce((sum, o) => sum + o.total, 0);
  
  // Revenue without delivery fees
  const revenueWithoutDelivery = orders
    .filter((o) => o.status === "delivered")
    .reduce((sum, o) => sum + (o.total - o.deliveryFees), 0);
  
  const losses = orders
    .filter((o) => o.status === "returned")
    .reduce((sum, o) => sum + o.total, 0);
  
  const netProfit = revenueWithoutDelivery - losses;
  
  const averageOrderValue = deliveredOrders > 0 ? totalRevenue / deliveredOrders : 0;

  // Additional analytics
  const totalDeliveryFees = orders
    .filter((o) => o.status === "delivered")
    .reduce((sum, o) => sum + o.deliveryFees, 0);

  const avgRating = orders
    .filter((o) => o.rating && o.rating > 0)
    .reduce((sum, o, _, arr) => sum + (o.rating / arr.length), 0);

  res.json({ 
    totalOrders, 
    deliveredOrders, 
    pendingOrders, 
    returnedOrders,
    shippedOrders,
    cancelledOrders,
    totalRevenue,
    revenueWithoutDelivery,
    netProfit, 
    losses,
    averageOrderValue,
    totalDeliveryFees,
    avgRating: avgRating || 0
  });
};
