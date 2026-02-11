const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const debugLogin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'admin@travollet.com';
        const password = 'admin'; 

        const user = await User.findOne({ email });

        if (!user) {
            console.log('❌ Admin user not found!');
        } else {
            console.log(`✅ Admin user found: ${user.email} (Role: ${user.role})`);

            
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                console.log('✅ Password "admin" is CORRECT.');
            } else {
                console.log('❌ Password "admin" is INCORRECT.');

                
                console.log('🔄 Resetting password to "admin"...');
                user.password = password; 
                await user.save();
                console.log('✅ Password reset to "admin" successful.');
            }
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
};

debugLogin();
