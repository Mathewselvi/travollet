const mongoose = require('mongoose');

const transportationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['bike_rental', 'scooter_rental', 'cab_with_driver']
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  pricePerDay: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  features: [{
    type: String,
    trim: true
  }],
  images: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  totalQuantity: {
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


transportationSchema.index({ type: 1, isActive: 1 });

module.exports = mongoose.model('Transportation', transportationSchema);