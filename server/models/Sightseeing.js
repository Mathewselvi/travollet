const mongoose = require('mongoose');

const sightseeingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  pricePerPerson: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  images: [{
    type: String,
    trim: true
  }],
  highlights: [{
    type: String,
    trim: true
  }],
  included: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  maxSlotsPerDay: {
    type: Number,
    default: 50,
    min: 1
  },
  unavailableDates: [{
    type: Date
  }]
}, {
  timestamps: true
});


sightseeingSchema.index({ isActive: 1 });

module.exports = mongoose.model('Sightseeing', sightseeingSchema);