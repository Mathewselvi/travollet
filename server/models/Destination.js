const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Popular Spot', 'Hidden Gem', 'Must Visit', 'Nature', 'Adventure'],
        default: 'Popular Spot'
    },
    images: [{
        type: String,
        required: true
    }],
    bestTimeToVisit: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Destination', destinationSchema);
