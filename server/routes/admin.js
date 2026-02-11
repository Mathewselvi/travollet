const express = require('express');
const { adminAuth } = require('../middleware/auth');
const Stay = require('../models/Stay');
const Transportation = require('../models/Transportation');
const Sightseeing = require('../models/Sightseeing');
const Package = require('../models/Package');
const TourPackage = require('../models/TourPackage');
const { sendEmail } = require('../utils/emailService');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const AirportTransfer = require('../models/AirportTransfer');

const router = express.Router();

const { storage } = require('../config/cloudinary');

const upload = multer({ storage: storage });



// Generic Upload Route (Does NOT add to Gallery)
router.post('/upload', adminAuth, upload.array('images', 20), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // Map files to the structure expected by the frontend
    const images = req.files.map(file => ({
      imageUrl: file.path
    }));

    res.status(201).json({
      message: 'Files uploaded successfully',
      images: images
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Server error during upload', error: error.message });
  }
});
router.get('/stays', adminAuth, async (req, res) => {
  try {
    const stays = await Stay.find().sort({ createdAt: -1 });
    res.json(stays);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.post('/stays', adminAuth, async (req, res) => {
  try {
    const stay = new Stay(req.body);
    await stay.save();
    res.status(201).json({ message: 'Stay added successfully', stay });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.put('/stays/:id', adminAuth, async (req, res) => {
  try {
    const stay = await Stay.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!stay) {
      return res.status(404).json({ message: 'Stay not found' });
    }
    res.json({ message: 'Stay updated successfully', stay });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.delete('/stays/:id', adminAuth, async (req, res) => {
  try {
    const stay = await Stay.findByIdAndDelete(req.params.id);
    if (!stay) {
      return res.status(404).json({ message: 'Stay not found' });
    }
    res.json({ message: 'Stay deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});




router.get('/transportation', adminAuth, async (req, res) => {
  try {
    const transportation = await Transportation.find().sort({ createdAt: -1 });
    res.json(transportation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.post('/transportation', adminAuth, async (req, res) => {
  try {
    const transportation = new Transportation(req.body);
    await transportation.save();
    res.status(201).json({ message: 'Transportation added successfully', transportation });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.put('/transportation/:id', adminAuth, async (req, res) => {
  try {
    const transportation = await Transportation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!transportation) {
      return res.status(404).json({ message: 'Transportation not found' });
    }
    res.json({ message: 'Transportation updated successfully', transportation });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.delete('/transportation/:id', adminAuth, async (req, res) => {
  try {
    const transportation = await Transportation.findByIdAndDelete(req.params.id);
    if (!transportation) {
      return res.status(404).json({ message: 'Transportation not found' });
    }
    res.json({ message: 'Transportation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});




router.get('/sightseeing', adminAuth, async (req, res) => {
  try {
    const sightseeing = await Sightseeing.find().sort({ createdAt: -1 });
    res.json(sightseeing);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.post('/sightseeing', adminAuth, async (req, res) => {
  try {
    const sightseeing = new Sightseeing(req.body);
    await sightseeing.save();
    res.status(201).json({ message: 'Sightseeing added successfully', sightseeing });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.put('/sightseeing/:id', adminAuth, async (req, res) => {
  try {
    const sightseeing = await Sightseeing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sightseeing) {
      return res.status(404).json({ message: 'Sightseeing not found' });
    }
    res.json({ message: 'Sightseeing updated successfully', sightseeing });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.delete('/sightseeing/:id', adminAuth, async (req, res) => {
  try {
    const sightseeing = await Sightseeing.findByIdAndDelete(req.params.id);
    if (!sightseeing) {
      return res.status(404).json({ message: 'Sightseeing not found' });
    }
    res.json({ message: 'Sightseeing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});




router.get('/destinations', adminAuth, async (req, res) => {
  try {
    const destinations = await require('../models/Destination').find().sort({ createdAt: -1 });
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.post('/destinations', adminAuth, async (req, res) => {
  try {
    const Destination = require('../models/Destination');
    const destination = new Destination(req.body);
    await destination.save();
    res.status(201).json({ message: 'Destination added successfully', destination });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.put('/destinations/:id', adminAuth, async (req, res) => {
  try {
    const Destination = require('../models/Destination');
    const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.json({ message: 'Destination updated successfully', destination });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.delete('/destinations/:id', adminAuth, async (req, res) => {
  try {
    const Destination = require('../models/Destination');
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.json({ message: 'Destination deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.get('/tour-packages', adminAuth, async (req, res) => {
  try {
    const tourPackages = await TourPackage.find()
      .populate('stayId', 'name')
      .populate('transportationId', 'name')
      .populate('sightseeingIds', 'name')
      .sort({ createdAt: -1 });
    res.json(tourPackages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.post('/tour-packages', adminAuth, async (req, res) => {
  try {
    const tourPackage = new TourPackage(req.body);
    await tourPackage.save();
    res.status(201).json({ message: 'Tour Package added successfully', tourPackage });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.put('/tour-packages/:id', adminAuth, async (req, res) => {
  try {
    const tourPackage = await TourPackage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tourPackage) {
      return res.status(404).json({ message: 'Tour Package not found' });
    }
    res.json({ message: 'Tour Package updated successfully', tourPackage });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.delete('/tour-packages/:id', adminAuth, async (req, res) => {
  try {
    const tourPackage = await TourPackage.findByIdAndDelete(req.params.id);
    if (!tourPackage) {
      return res.status(404).json({ message: 'Tour Package not found' });
    }
    res.json({ message: 'Tour Package deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});




router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const stats = {
      totalStays: await Stay.countDocuments({ isActive: true }),
      totalTransportation: await Transportation.countDocuments({ isActive: true }),
      totalSightseeing: await Sightseeing.countDocuments({ isActive: true }),
      totalSightseeing: await Sightseeing.countDocuments({ isActive: true }),
      totalBookings: await Package.countDocuments(),
      totalTourPackages: await TourPackage.countDocuments({ isActive: true }),
      bookedPackages: await Package.countDocuments({ status: 'booked' }),
      recentPackages: await Package.find()
        .populate('userId', 'name email')
        .populate('stayId', 'name category')
        .sort({ createdAt: -1 })
        .limit(10)
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.get('/packages', adminAuth, async (req, res) => {
  try {
    const packages = await Package.find()
      .populate('userId', 'name email phone')
      .populate('stayId', 'name category pricePerNight')
      .populate('transportationId', 'name type pricePerDay')
      .populate('sightseeingIds', 'name pricePerPerson')
      .sort({ createdAt: -1 });
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.put('/packages/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const package = await Package.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('userId', 'name email');

    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    // Send confirmation email if status is changed to 'confirmed'
    if (status === 'confirmed' && package.userId && package.userId.email) {
      try {
        const checkIn = new Date(package.checkInDate).toLocaleDateString();
        const checkOut = new Date(package.checkOutDate).toLocaleDateString();

        const userHtml = `
          <h1>Booking Confirmed!</h1>
          <p>Dear ${package.userId.name},</p>
          <p>Great news! Your booking for <strong>${package.stayId.name}</strong> has been <strong>CONFIRMED</strong>.</p>
          <p><strong>Dates:</strong> ${checkIn} - ${checkOut}</p>
          <p><strong>Total Paid:</strong> ₹${package.pricing.grandTotal.toLocaleString()}</p>
          <p>We look forward to hosting you!</p>
          <p>Booking ID: ${package._id}</p>
        `;

        await sendEmail(package.userId.email, 'Booking Confirmed - Travollet', userHtml);
        console.log(`[EMAIL] Confirmation email sent to ${package.userId.email}`);
      } catch (emailError) {
        console.error('[EMAIL] Failed to send confirmation email:', emailError);
      }
    }

    // Send cancellation email if status is changed to 'cancelled'
    if (status === 'cancelled' && package.userId && package.userId.email) {
      try {
        const checkIn = new Date(package.checkInDate).toLocaleDateString();
        const checkOut = new Date(package.checkOutDate).toLocaleDateString();

        const userHtml = `
          <h1>Booking Cancelled</h1>
          <p>Dear ${package.userId.name},</p>
          <p>We regret to inform you that your booking for <strong>${package.stayId.name}</strong> (Booking ID: ${package._id}) has been <strong>CANCELLED</strong>.</p>
          <p><strong>Original Dates:</strong> ${checkIn} - ${checkOut}</p>
          <p>If you have any questions or believe this is an error, please contact our support team immediately.</p>
          <p>Any processed payments will be refunded according to our refund policy.</p>
        `;

        await sendEmail(package.userId.email, 'Booking Cancelled - Travollet', userHtml);
        console.log(`[EMAIL] Cancellation email sent to ${package.userId.email}`);
      } catch (emailError) {
        console.error('[EMAIL] Failed to send cancellation email:', emailError);
      }
    }

    res.json({ message: 'Package status updated successfully', package });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.delete('/packages/:id', adminAuth, async (req, res) => {
  try {
    const package = await Package.findByIdAndDelete(req.params.id);
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.json({ message: 'Package deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.put('/packages/:id/early-checkout', adminAuth, async (req, res) => {
  try {
    const { checkOutDate } = req.body;


    const package = await Package.findByIdAndUpdate(
      req.params.id,
      {
        checkOutDate: new Date(checkOutDate),
        status: 'completed'
      },
      { new: true }
    ).populate('userId', 'name email');

    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    res.json({ message: 'Early checkout processed successfully', package });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/packages/:id/refund', adminAuth, async (req, res) => {
  try {
    const package = await Package.findById(req.params.id).populate('userId', 'name email');

    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    if (package.paymentStatus === 'refunded') {
      return res.status(400).json({ message: 'Package is already refunded' });
    }

    package.paymentStatus = 'refunded';
    await package.save();

    // Send refund email
    if (package.userId && package.userId.email) {
      try {
        const userHtml = `
          <h1>Refund Processed</h1>
          <p>Dear ${package.userId.name},</p>
          <p>A refund has been processed for your booking (ID: ${package._id}).</p>
          <p><strong>Amount Refunded:</strong> ₹${package.pricing.grandTotal.toLocaleString()}</p>
          <p>The amount should reflect in your original payment method within 5-7 business days.</p>
          <p>If you have any questions, please contact our support.</p>
        `;

        await sendEmail(package.userId.email, 'Refund Processed - Travollet', userHtml);
        console.log(`[EMAIL] Refund email sent to ${package.userId.email}`);
      } catch (emailError) {
        console.error('[EMAIL] Failed to send refund email:', emailError);
      }
    }

    res.json({ message: 'Refund processed successfully', package });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Airport Transfer Routes
router.get('/airport-transfers', adminAuth, async (req, res) => {
  try {
    const transfers = await AirportTransfer.find().sort({ price: 1 });
    res.json(transfers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/airport-transfers', adminAuth, async (req, res) => {
  try {
    const transfer = new AirportTransfer(req.body);
    await transfer.save();
    res.status(201).json({ message: 'Airport transfer option added', transfer });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/airport-transfers/:id', adminAuth, async (req, res) => {
  try {
    const transfer = await AirportTransfer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!transfer) {
      return res.status(404).json({ message: 'Option not found' });
    }
    res.json({ message: 'Option updated successfully', transfer });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/airport-transfers/:id', adminAuth, async (req, res) => {
  try {
    const transfer = await AirportTransfer.findByIdAndDelete(req.params.id);
    if (!transfer) {
      return res.status(404).json({ message: 'Option not found' });
    }
    res.json({ message: 'Option deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;