const mongoose = require('mongoose');
require('dotenv').config();
const AirportTransfer = require('./models/AirportTransfer');

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const transfers = await AirportTransfer.find();
  console.log("Transfers:", transfers);
  process.exit();
}
check();
