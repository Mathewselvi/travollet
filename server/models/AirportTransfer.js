const mongoose = require('mongoose');

const airportTransferSchema = new mongoose.Schema({
    vehicleType: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        trim: true
    },
    maxPassengers: {
        type: Number,
        default: 4
    },
    isActive: {
        type: Boolean,
        default: true
    },
    images: [{
        type: String
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('AirportTransfer', airportTransferSchema);
