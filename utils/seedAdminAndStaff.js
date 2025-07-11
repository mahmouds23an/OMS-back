const User = require("../models/User");

const seedAdminAndStaff = async () => {
  const adminExists = await User.findOne({ email: "admin@admin.com" });
  if (!adminExists) {
    await User.create({
      email: "admin@admin.com",
      password: "admin123",
      role: "admin",
      name: "Admin",
    });
    console.log("Admin created");
  } else {
    console.log("Admin already exists");
  }

  const staffExists = await User.findOne({ email: "staff@staff.com" });
  if (!staffExists) {
    await User.create({
      email: "staff@staff.com",
      password: "staff123",
      role: "employee",
      name: "Staff",
    });
    console.log("Staff created");
  } else {
    console.log("Staff already exists");
  }
};

module.exports = seedAdminAndStaff;
