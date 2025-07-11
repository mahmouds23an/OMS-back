const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const clientRoutes = require("./routes/clientRoutes");
const orderRoutes = require("./routes/orderRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const seedAdminAndStaff = require("./utils/seedAdminAndStaff");

dotenv.config();
connectDB().then(seedAdminAndStaff);

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/employees", userRoutes);
app.use("/clients", clientRoutes);
app.use("/orders", orderRoutes);
app.use("/analytics", analyticsRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
