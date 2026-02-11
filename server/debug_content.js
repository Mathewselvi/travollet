const mongoose = require('mongoose');
require('dotenv').config();
const SiteContent = require('./models/SiteContent');

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to DB');
        try {
            const content = await SiteContent.find({});
            console.log('Content found:', content);
        } catch (err) {
            console.error('Error finding content:', err);
        } finally {
            mongoose.disconnect();
        }
    })
    .catch(err => console.error('DB Connection Error:', err));
