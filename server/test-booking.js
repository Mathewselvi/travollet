const mongoose = require('mongoose');
require('dotenv').config({path: '/Users/mathewselvi/Desktop/travollet/server/.env'});
const Package = require('/Users/mathewselvi/Desktop/travollet/server/models/Package');
const TourPackage = require('/Users/mathewselvi/Desktop/travollet/server/models/TourPackage');

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected");
  
  // Backfill existing packages if there are any that match
  const tps = await TourPackage.find({ isActive: true });
  for (const packageDoc of await Package.find({ tourPackageId: { $exists: false } })) {
    // If they have the exact same stay, transport, sightseeing as a tour package, and grandTotal == tourPackage.price * ...
    // we could try to guess. But let's just observe.
    console.log("Found package without tourPackageId:", packageDoc._id);
  }
  process.exit();
}
test();
