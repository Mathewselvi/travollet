const mongoose = require('mongoose');
require('dotenv').config();

const Stay = require('./models/Stay');
const Transportation = require('./models/Transportation');
const Sightseeing = require('./models/Sightseeing');
const Destination = require('./models/Destination');
const Package = require('./models/Package');
const TourPackage = require('./models/TourPackage');
const User = require('./models/User');

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const stays = await Stay.countDocuments();
        const transportation = await Transportation.countDocuments();
        const sightseeing = await Sightseeing.countDocuments();
        const destinations = await Destination.countDocuments();
        const packages = await Package.countDocuments();
        const tourPackages = await TourPackage.countDocuments();

        const adminUser = await User.findOne({ email: 'admin@travollet.com' });

        console.log('--- Database Counts ---');
        console.log(`Stays: ${stays}`);
        console.log(`Transportation: ${transportation}`);
        console.log(`Sightseeing: ${sightseeing}`);
        console.log(`Destinations: ${destinations}`);
        console.log(`Packages (Bookings): ${packages}`);
        console.log(`Tour Packages: ${tourPackages}`);
        console.log('--- Admin User Check ---');
        if (adminUser) {
            console.log(`Admin User Found: ${adminUser.email}`);
            console.log(`Role: ${adminUser.role}`); 
        } else {
            console.log('Admin User NOT Found!');
        }
        console.log('-----------------------');

        mongoose.connection.close();
    } catch (error) {
        console.error('Error checking data:', error);
        process.exit(1);
    }
};

checkData();
