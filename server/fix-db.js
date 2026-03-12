const mongoose = require('mongoose');
require('dotenv').config({path: '/Users/mathewselvi/Desktop/travollet/server/.env'});
const Package = require('/Users/mathewselvi/Desktop/travollet/server/models/Package');
const TourPackage = require('/Users/mathewselvi/Desktop/travollet/server/models/TourPackage');

async function fix() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB!");

  const munnarEscape = await TourPackage.findOne({ title: 'Munnar Nature Escape' });
  if (munnarEscape) {
    const pkg = await Package.findById('69b21ccaa40acefb81ae299e');
    if (pkg && !pkg.tourPackageId) {
      pkg.tourPackageId = munnarEscape._id;
      await pkg.save();
      console.log('Fixed old booking 69b... to have tourPackageId:', munnarEscape._id);
    } else {
      console.log('Booking already fixed or not found.');
    }
  } else {
    console.log("Munnar Nature Escape TourPackage not found. Did you delete it?");
  }

  process.exit();
}
fix();
