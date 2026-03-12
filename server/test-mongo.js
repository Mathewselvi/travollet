const mongoose = require('mongoose');
require('dotenv').config();

async function findUsers() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const users = await db.collection('users').find({ role: 'admin' }).toArray();
  console.log(JSON.stringify(users, null, 2));
  process.exit(0);
}
findUsers();
