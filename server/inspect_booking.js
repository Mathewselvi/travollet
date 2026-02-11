const mongoose = require('mongoose');
const Package = require('./models/Package');
const Stay = require('./models/Stay');
require('dotenv').config({ path: './.env' });

const inspect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        
        const stay = await Stay.findOne({ name: { $regex: /Gowri's Homestay/i } });
        if (!stay) {
            console.log("Stats: Stay 'Gowri's Homestay' NOT FOUND");
        } else {
            console.log(`Stay Found: ${stay.name} (${stay._id})`);
        }

        // 2. Find bookings for this Stay around Jan 2026
        if (stay) {
            const bookings = await Package.find({
                stayId: stay._id,
                checkInDate: { $gte: new Date('2026-01-01'), $lte: new Date('2026-02-01') }
            });

            console.log(`Found ${bookings.length} bookings for this stay in Jan 2026:`);
            bookings.forEach(b => {
                console.log(`- Booking ID: ${b._id}`);
                console.log(`  Status: ${b.status}`);
                console.log(`  Dates: ${b.checkInDate.toISOString()} to ${b.checkOutDate.toISOString()}`);
                console.log(`  Raw CheckIn: ${b.checkInDate}`);
                console.log(`  Raw CheckOut: ${b.checkOutDate}`);
            });

            // 3. Test Overlap Logic against these specific bookings
            const searchCheckIn = new Date('2026-01-24');
            const searchCheckOut = new Date('2026-01-26');
            console.log(`\nTesting Search Query: ${searchCheckIn.toISOString()} to ${searchCheckOut.toISOString()}`);

            const conflicts = await Package.find({
                stayId: stay._id,
                status: { $ne: 'cancelled' },
                $or: [
                    { checkInDate: { $lt: searchCheckOut }, checkOutDate: { $gt: searchCheckIn } }
                ]
            });
            console.log(`Simulated Query Found ${conflicts.length} conflicts.`);
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
    }
};

inspect();
