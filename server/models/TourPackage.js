const mongoose = require('mongoose');

const tourPackageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true 
    },
    stayId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stay',
        required: false
    },
    transportationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transportation',
        required: false
    },
    sightseeingIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sightseeing'
    }],
    destinations: [{
        type: String
    }],
    duration: {
        days: {
            type: Number,
            required: true
        },
        nights: {
            type: Number,
            required: true
        }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('TourPackage', tourPackageSchema);
