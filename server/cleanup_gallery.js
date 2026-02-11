const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Gallery = require('./models/Gallery');
const Stay = require('./models/Stay');
const Transportation = require('./models/Transportation');
const Sightseeing = require('./models/Sightseeing');


// Adjust path to point to server/.env when running from root
// .env is in the same directory as this script
dotenv.config({ path: require('path').join(__dirname, '.env') });

const cleanUpGallery = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // 1. Fetch all resource images
        const stays = await Stay.find({}, 'images');
        const transport = await Transportation.find({}, 'images');
        const sightseeing = await Sightseeing.find({}, 'images');

        const resourceImages = new Set();

        stays.forEach(s => s.images.forEach(img => resourceImages.add(img)));
        transport.forEach(t => t.images.forEach(img => resourceImages.add(img)));
        sightseeing.forEach(s => s.images.forEach(img => resourceImages.add(img)));

        console.log(`Found ${resourceImages.size} unique resource images.`);

        // 2. Fetch all Gallery images
        const galleryImages = await Gallery.find({});
        console.log(`Found ${galleryImages.length} gallery images.`);

        let deletedCount = 0;

        // 3. Check for overlaps and delete from Gallery
        for (const img of galleryImages) {
            if (resourceImages.has(img.imageUrl) || resourceImages.has(img.imageUrl.replace('/uploads', '/uploads/'))) {
                // Exact match check
                console.log(`Deleting duplicate gallery entry: ${img.imageUrl}`);
                await Gallery.findByIdAndDelete(img._id);
                deletedCount++;
            }
        }

        console.log(`Cleanup complete. Removed ${deletedCount} images from Gallery that were attached to other resources.`);

    } catch (error) {
        console.error('Error during cleanup:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

cleanUpGallery();
