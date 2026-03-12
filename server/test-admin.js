const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function checkAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;

    let admin = await db.collection('users').findOne({ role: 'admin' });
    if (!admin) {
      console.log("No admin found. Creating one...");
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash('admin123', salt);
      await db.collection('users').insertOne({
        name: "Admin",
        email: "admin@travollet.com",
        password,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      console.log("Admin created: admin@travollet.com / admin123")
    } else {
      console.log(`Admin found! Email: ${admin.email}`);
      // If password is unknown, we can force reset it.
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash('admin123', salt);
      await db.collection('users').updateOne(
        { _id: admin._id },
        { $set: { password } }
      );
      console.log(`Password reset to: admin123`);
    }
  } catch (e) {
    console.error("Error:", e);
  } finally {
    process.exit(0);
  }
}
checkAdmin();
