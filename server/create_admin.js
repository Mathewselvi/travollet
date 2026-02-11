const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const adminEmail = 'admin@travollet.com';
        const adminPassword = 'admin123';

        let user = await User.findOne({ email: adminEmail });

        if (!user) {
            console.log('Creating new admin user...');
            user = new User({
                email: adminEmail,
                name: 'Travollet Admin',
                phone: '1234567890',
                role: 'admin'
            });
        } else {
            console.log('Updating existing admin user...');
            user.name = 'Travollet Admin';
            user.phone = '1234567890';
            user.role = 'admin';
        }

        
        user.password = adminPassword;
        
        
        
        
        
        user.markModified('password');

        await user.save();

        console.log('Admin credentials updated successfully.');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);

        mongoose.connection.close();
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
