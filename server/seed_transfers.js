const mongoose = require('mongoose');
const AirportTransfer = require('./models/AirportTransfer');
require('dotenv').config();

const seedTransfers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travollet');
        console.log('Connected to MongoDB');

        const transfers = [
            {
                vehicleType: 'Sedan',
                price: 1500,
                description: 'Comfortable sedan for up to 4 passengers',
                maxPassengers: 4,
                isActive: true,
                images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2940&auto=format&fit=crop']
            },
            {
                vehicleType: 'SUV',
                price: 2500,
                description: 'Spacious SUV for larger groups or more luggage',
                maxPassengers: 6,
                isActive: true,
                images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2940&auto=format&fit=crop']
            },
            {
                vehicleType: 'Hatchback',
                price: 1200,
                description: 'Budget-friendly option for small groups',
                maxPassengers: 4,
                isActive: true,
                images: ['https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2940&auto=format&fit=crop']
            }
        ];

        await AirportTransfer.deleteMany({}); // Clear existing
        await AirportTransfer.insertMany(transfers);

        console.log('Airport transfers seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding transfers:', error);
        process.exit(1);
    }
};

seedTransfers();
