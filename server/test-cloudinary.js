const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: '/Users/mathewselvi/Desktop/travollet/server/.env' });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'travollet_uploads',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
});

const upload = multer({ storage: storage });

const app = express();

app.post('/upload', upload.array('images', 5), (req, res) => {
    console.log("Req files:", req.files);
    const images = req.files.map(f => ({ imageUrl: f.path }));
    res.json({ images });
});

app.listen(9999, () => {
    console.log("Listening on 9999 for test");
    const axios = require('axios');
    const FormData = require('form-data');
    const fs = require('fs');
    
    setTimeout(async () => {
        const form = new FormData();
        fs.writeFileSync('/tmp/dummy.jpg', 'fake image content');
        form.append('images', fs.createReadStream('/tmp/dummy.jpg'));
        try {
            const result = await axios.post('http://localhost:9999/upload', form, {
                headers: form.getHeaders()
            });
            console.log("RESULT:", result.data);
        } catch(e) {
            console.error(e.response?.data);
        }
        process.exit();
    }, 1000);
});
