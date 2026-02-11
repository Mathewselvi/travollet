const mongoose = require('mongoose');

const staySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['basic', 'premium', 'luxury']
  },
  pricePerNight: {
    type: Number,
    required: true,
    min: 0
  },
  maxOccupancy: {
    type: Number,
    required: true,
    min: 1
  },
  amenities: [{
    type: String,
    trim: true
  }],
  images: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalRooms: {
    type: Number,
    default: 1,
    min: 1
  },
  unavailableDates: [{
    type: Date
  }]
}, {
  timestamps: true
});


staySchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model('Stay', staySchema);