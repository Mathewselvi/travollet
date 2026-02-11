const express = require('express');
const router = express.Router();
const SiteContent = require('../models/SiteContent');
const { adminAuth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../uploads/content');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }
});




// Debugging Model Loading
console.log('SiteContent Model Loaded:', SiteContent);

router.get('/', async (req, res) => {
    console.log('[CONTENT] GET / request received');
    try {
        if (!SiteContent) {
            throw new Error('SiteContent model is undefined');
        }
        console.log('[CONTENT] Querying DB...');
        const content = await SiteContent.find({});
        console.log('[CONTENT] Found items:', content ? content.length : 'null');
        res.json(content);
    } catch (error) {
        console.error('[CONTENT] CRITICAL ERROR:', error);
        res.status(500).json({ message: 'Server error', error: error.message, stack: error.stack });
    }
});




router.put('/:key', adminAuth, upload.single('image'), async (req, res) => {
    try {
        const { key } = req.params;
        const content = await SiteContent.findOne({ key });

        if (!content) {
            return res.status(404).json({ message: 'Content key not found' });
        }

        if (req.file) {

            if (content.imageUrl && content.imageUrl.startsWith('/uploads/')) {
                const oldPath = path.join(__dirname, '..', content.imageUrl);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            content.imageUrl = `/uploads/content/${req.file.filename}`;
        } else if (req.body.imageUrl) {

            content.imageUrl = req.body.imageUrl;
        }

        content.updatedAt = Date.now();
        await content.save();

        res.json(content);
    } catch (error) {
        console.error('Update Content Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});




router.post('/initialize', async (req, res) => {
    try {
        const defaults = [

            {
                key: 'home_hero_bg',
                label: 'Hero Background',
                section: 'Home Page',
                imageUrl: 'https://images.unsplash.com/photo-1580818135730-ebd11086660b?q=80&w=2314&auto=format&fit=crop',
                description: 'Main banner video/image'
            },
            {
                key: 'home_category_basic',
                label: 'Basic Explorer Card',
                section: 'Home Page',
                imageUrl: 'https://images.unsplash.com/photo-1629813538702-64c925934e19?q=80&w=4000&auto=format&fit=crop',
                description: 'Image for Basic category card'
            },
            {
                key: 'home_category_premium',
                label: 'Premium Comfort Card',
                section: 'Home Page',
                imageUrl: 'https://images.unsplash.com/photo-1686376351261-7a1d6e6e2939?q=80&w=1335&auto=format&fit=crop',
                description: 'Image for Premium category card'
            },
            {
                key: 'home_category_luxury',
                label: 'Luxury Elite Card',
                section: 'Home Page',
                imageUrl: 'https://images.unsplash.com/photo-1663597676642-6a3d7afdbff3?q=80&w=1287&auto=format&fit=crop',
                description: 'Image for Luxury category card'
            },
            {
                key: 'home_philosophy_bg',
                label: 'Philosophy Section',
                section: 'Home Page',



                imageUrl: '/assets/philosophy.jpg',
                description: 'Image for Our Philosophy section'
            },

            {
                key: 'login_hero_bg',
                label: 'Login Hero',
                section: 'Auth Pages',
                imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80',
                description: 'Side image on Login page'
            },
            {
                key: 'register_hero_bg',
                label: 'Register Hero',
                section: 'Auth Pages',
                imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80',
                description: 'Side image on Register page'
            },

            {
                key: 'destinations_hero_bg',
                label: 'Destinations Hero',
                section: 'Main Pages',
                imageUrl: 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1976&q=80',
                description: 'Banner for Destinations page'
            },
            {
                key: 'packages_hero_bg',
                label: 'Packages Hero',
                section: 'Main Pages',
                imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80',
                description: 'Banner for Packages page'
            },
            {
                key: 'customize_hero_bg',
                label: 'Customize Hero',
                section: 'Main Pages',
                imageUrl: 'https://images.unsplash.com/photo-1637066742971-726bee8d9f56?q=80&w=3649&auto=format&fit=crop',
                description: 'Banner for Customize page'
            },
            {
                key: 'gallery_hero_bg',
                label: 'Gallery Page Hero',
                section: 'Main Pages',
                imageUrl: 'https://images.unsplash.com/photo-1500835556837-99ac94a94552?q=80&w=1920&auto=format&fit=crop',
                description: 'Banner for Gallery page'
            },

            {
                key: 'category_basic_hero',
                label: 'Basic Category Hero',
                section: 'Category Pages',
                imageUrl: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
                description: 'Hero for Basic Collection'
            },
            {
                key: 'category_premium_hero',
                label: 'Premium Category Hero',
                section: 'Category Pages',
                imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
                description: 'Hero for Premium Collection'
            },
            {
                key: 'category_luxury_hero',
                label: 'Luxury Category Hero',
                section: 'Category Pages',
                imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
                description: 'Hero for Luxury Collection'
            }
        ];

        for (const item of defaults) {



            const existing = await SiteContent.findOne({ key: item.key });
            if (!existing) {
                await SiteContent.create(item);
            }
        }

        res.json({ message: 'Content initialized successfully' });
    } catch (error) {
        console.error('Initialize Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
