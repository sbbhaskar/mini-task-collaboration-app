// seedAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const existing = await User.findOne({ email: 'admin@example.com' });

    if (existing) {
      console.log('👑 Admin already exists');
    } else {
      const admin = new User({
        name: "Admin",
        email: "admin@example.com",
        password: "admin123", // will be hashed automatically
        role: "admin"
      });

      await admin.save();
      console.log("✅ Admin user created successfully");
    }

    process.exit();
  } catch (err) {
    console.error("❌ Failed to seed admin:", err.message);
    process.exit(1);
  }
};

run();
