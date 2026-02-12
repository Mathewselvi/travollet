const express = require('express');
const router = express.Router();
const multer = require('multer');
const Gallery = require('../models/Gallery');
const { adminAuth } = require('../middleware/auth');
const { storage, cloudinary } = require('../config/cloudinary');

const upload = multer({ storage: storage });

router.post('/', adminAuth, upload.array('images', 20), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No image files uploaded' });
        }

        const uploadedImages = [];

        for (const file of req.files) {

            // Cloudinary storage puts the url in file.path and public_id in file.filename (or file.public_id depending on config)
            const imageUrl = file.path;
            const publicId = file.filename; // multer-storage-cloudinary uses filename for public_id

            const newImage = new Gallery({
                imageUrl,
                caption: req.body.caption || '',
                publicId: publicId,
                uploadedBy: req.user ? req.user.id : null
            });

            await newImage.save();
            uploadedImages.push(newImage);
        }

        res.status(201).json({
            message: `${uploadedImages.length} images uploaded successfully`,
            images: uploadedImages
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: 'Server error during upload', error: error.message });
    }
});


router.get('/', async (req, res) => {
    try {
        const images = await Gallery.find().sort({ createdAt: -1 });
        res.json(images);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const image = await Gallery.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        // Delete from Cloudinary
        if (image.publicId) {
            await cloudinary.uploader.destroy(image.publicId);
        }

        await Gallery.findByIdAndDelete(req.params.id);

        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Delete Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
