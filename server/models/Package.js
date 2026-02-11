const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stayId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stay',
    required: true
  },
  transportationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transportation'
  },
  sightseeingIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sightseeing'
  }],
  numberOfPeople: {
    type: Number,
    required: true,
    min: 1
  },
  numberOfDays: {
    type: Number,
    required: true,
    min: 1
  },
  checkInDate: {
    type: Date,
    required: true
  },
  checkOutDate: {
    type: Date,
    required: true
  },
  pricing: {
    stayTotal: {
      type: Number,
      required: true
    },
    transportationTotal: {
      type: Number,
      default: 0
    },
    sightseeingTotal: {
      type: Number,
      default: 0
    },
    airportTransfer: {
      type: Number,
      default: 0
    },
    grandTotal: {
      type: Number,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['draft', 'booked', 'confirmed', 'completed', 'cancelled'],
    default: 'draft'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  specialRequests: {
    type: String,
    trim: true
  },
  razorpayOrderId: {
    type: String
  },
  razorpayPaymentId: {
    type: String
  },
  airportTransferDetails: {
    vehicles: [{
      vehicleType: { type: String, trim: true },
      count: { type: Number, default: 1 },
      price: { type: Number, default: 0 },
      image: { type: String }
    }],
    arrivalFlight: { type: String, trim: true },
    arrivalTime: { type: Date },
    departureFlight: { type: String, trim: true },
    departureTime: { type: Date }
  }
}, {
  timestamps: true
});


packageSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Package', packageSchema);