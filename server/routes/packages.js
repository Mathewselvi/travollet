const express = require('express');
const { checkAvailability } = require('../utils/availability');
const { auth } = require('../middleware/auth');
const Package = require('../models/Package');
const Stay = require('../models/Stay');
const Transportation = require('../models/Transportation');
const Sightseeing = require('../models/Sightseeing');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret'
});

// Shared utility checkAvailability is imported at the top


router.get('/check-availability', async (req, res) => {
  try {
    const { stayId, transportationId, sightseeingIds, checkInDate, checkOutDate, numberOfPeople, packageId } = req.query;

    const sIds = sightseeingIds ? (Array.isArray(sightseeingIds) ? sightseeingIds : [sightseeingIds]) : [];

    const result = await checkAvailability(
      stayId,
      transportationId,
      sIds,
      checkInDate,
      checkOutDate,
      parseInt(numberOfPeople) || 1,
      packageId
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/create', auth, async (req, res) => {
  try {
    const {
      stayId,
      transportationId,
      sightseeingIds = [],
      numberOfPeople,
      numberOfDays,
      checkInDate,
      checkOutDate,
      specialRequests
    } = req.body;

    // Check availability
    const availResult = await checkAvailability(stayId, transportationId, sightseeingIds, checkInDate, checkOutDate, numberOfPeople);
    if (!availResult.available) {
      return res.status(400).json({ message: availResult.message });
    }


    const stay = await Stay.findById(stayId);
    if (!stay || !stay.isActive) {
      return res.status(404).json({ message: 'Stay not found' });
    }


    let transportation = null;
    if (transportationId) {
      transportation = await Transportation.findById(transportationId);
      if (!transportation || !transportation.isActive) {
        return res.status(404).json({ message: 'Transportation not found' });
      }
    }


    let sightseeing = [];
    if (sightseeingIds && sightseeingIds.length > 0) {
      sightseeing = await Sightseeing.find({
        _id: { $in: sightseeingIds },
        isActive: true
      });
    }


    const stayTotal = stay.pricePerNight * numberOfDays;
    const transportationTotal = transportation ? (transportation.pricePerDay * numberOfDays) : 0;
    const sightseeingTotal = sightseeing.reduce((total, sight) =>
      total + (sight.pricePerPerson * numberOfPeople), 0
    );
    const grandTotal = stayTotal + transportationTotal + sightseeingTotal;


    const package = new Package({
      userId: req.user._id,
      stayId,
      transportationId,
      sightseeingIds,
      numberOfPeople,
      numberOfDays,
      checkInDate,
      checkOutDate,
      pricing: {
        stayTotal,
        transportationTotal,
        sightseeingTotal,
        grandTotal
      },
      specialRequests,
      status: 'draft'
    });

    await package.save();


    const populatedPackage = await Package.findById(package._id)
      .populate('stayId', 'name category pricePerNight location amenities images')
      .populate('transportationId', 'name type pricePerDay description features')
      .populate('sightseeingIds', 'name pricePerPerson duration description location');

    res.status(201).json({
      message: 'Package created successfully',
      package: populatedPackage
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.put('/:id/book', auth, async (req, res) => {
  try {
    const package = await Package.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    package.status = 'booked';
    await package.save();

    const populatedPackage = await Package.findById(package._id)
      .populate('stayId', 'name category location')
      .populate('transportationId', 'name type')
      .populate('sightseeingIds', 'name location');

    res.json({
      message: 'Package booked successfully',
      package: populatedPackage
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// Razorpay: Create Order
router.post('/:id/create-order', auth, async (req, res) => {
  try {
    const package = await Package.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    // Double check availability before taking payment
    const availResult = await checkAvailability(
      package.stayId,
      package.transportationId,
      package.sightseeingIds,
      package.checkInDate,
      package.checkOutDate,
      package.numberOfPeople,
      package._id
    );

    if (!availResult.available) {
      return res.status(400).json({ message: availResult.message });
    }

    const options = {
      amount: Math.round(package.pricing.grandTotal * 100), // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_${package._id}`,
    };

    // If keys are dummy, return a mock order immediately to avoid 401 from Razorpay
    if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'rzp_test_dummy_id') {
      const mockOrder = {
        id: `order_mock_${Date.now()}`,
        amount: options.amount,
        currency: "INR",
        receipt: options.receipt,
        status: 'created',
        is_mock: true
      };

      package.razorpayOrderId = mockOrder.id;
      await package.save();
      return res.json(mockOrder);
    }

    const order = await razorpay.orders.create(options);

    // Save order ID to package
    package.razorpayOrderId = order.id;
    await package.save();

    res.json(order);
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    res.status(500).json({ message: 'Error creating Razorpay order', error: error.message });
  }
});

// Razorpay: Verify Payment
const { sendEmail } = require('../utils/emailService');

// ... (existing imports)

// Check Availability Route ... (unchanged)

// ...

// Razorpay: Verify Payment
router.post('/:id/verify-payment', auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const packageId = req.params.id;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'dummy_secret')
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign || process.env.RAZORPAY_KEY_ID === 'rzp_test_dummy_id' || !process.env.RAZORPAY_KEY_ID) {
      // Payment verified (or skip verification if using dummy/default ID for development)
      const package = await Package.findOne({
        _id: packageId,
        userId: req.user._id
      });

      if (!package) {
        return res.status(404).json({ message: 'Package not found' });
      }

      // Final check availability just in case
      const availResult = await checkAvailability(
        package.stayId,
        package.transportationId,
        package.sightseeingIds,
        package.checkInDate,
        package.checkOutDate,
        package.numberOfPeople,
        package._id
      );

      if (!availResult.available) {
        return res.status(400).json({ message: availResult.message });
      }

      package.status = 'booked';
      package.paymentStatus = 'paid';
      package.razorpayPaymentId = razorpay_payment_id;
      await package.save();

      // Send Email Notifications
      try {
        const fullPackage = await Package.findById(package._id)
          .populate('userId', 'name email phone')
          .populate('stayId', 'name location')
          .populate('transportationId', 'name type')
          .populate('sightseeingIds', 'name pricePerPerson');

        if (fullPackage && fullPackage.userId && fullPackage.userId.email) {
          const checkIn = new Date(fullPackage.checkInDate).toLocaleDateString();
          const checkOut = new Date(fullPackage.checkOutDate).toLocaleDateString();

          const userHtml = `
            <h1>Payment Received</h1>
            <p>Dear ${fullPackage.userId.name},</p>
            <p>We have received your payment of <strong>₹${fullPackage.pricing.grandTotal.toLocaleString()}</strong> for <strong>${fullPackage.stayId.name}</strong>.</p>
            <p><strong>Dates:</strong> ${checkIn} - ${checkOut}</p>
            <p>Your booking is currently <strong>PENDING CONFIRMATION</strong>. We will review your booking and send you a confirmation email shortly.</p>
            <p>Booking ID: ${fullPackage._id}</p>
          `;

          await sendEmail(fullPackage.userId.email, 'Payment Received - Booking Pending - Travollet', userHtml);

          if (process.env.ADMIN_EMAIL) {
            const transportHtml = fullPackage.transportationId
              ? `<p><strong>Transportation:</strong> ${fullPackage.transportationId.name} (${fullPackage.transportationId.type}) - ₹${fullPackage.pricing.transportationTotal.toLocaleString()}</p>`
              : '<p><strong>Transportation:</strong> None Selected</p>';

            const sightseeingHtml = fullPackage.sightseeingIds && fullPackage.sightseeingIds.length > 0
              ? `<p><strong>Sightseeing:</strong></p><ul>${fullPackage.sightseeingIds.map(s => `<li>${s.name} - ₹${s.pricePerPerson}</li>`).join('')}</ul>`
              : '<p><strong>Sightseeing:</strong> None Selected</p>';

            const adminHtml = `
              <h1>New Booking Received</h1>
              <h2>Customer Details</h2>
              <p><strong>Name:</strong> ${fullPackage.userId.name}</p>
              <p><strong>Email:</strong> ${fullPackage.userId.email}</p>
              <p><strong>Phone:</strong> ${fullPackage.userId.phone || 'N/A'}</p>
              
              <h2>Booking Details</h2>
              <p><strong>Booking ID:</strong> ${fullPackage._id}</p>
              <p><strong>Dates:</strong> ${checkIn} - ${checkOut} (${fullPackage.numberOfDays} Days)</p>
              <p><strong>Guests:</strong> ${fullPackage.numberOfPeople}</p>
              
              <h2>Itinerary</h2>
              <p><strong>Stay:</strong> ${fullPackage.stayId.name} (${fullPackage.stayId.location})</p>
              ${transportHtml}
              ${sightseeingHtml}
              
              <h2>Pricing</h2>
              <p><strong>Stay Total:</strong> ₹${fullPackage.pricing.stayTotal.toLocaleString()}</p>
              <p><strong>Transport Total:</strong> ₹${fullPackage.pricing.transportationTotal.toLocaleString()}</p>
              <p><strong>Sightseeing Total:</strong> ₹${fullPackage.pricing.sightseeingTotal.toLocaleString()}</p>
              <p><strong>GRAND TOTAL:</strong> ₹${fullPackage.pricing.grandTotal.toLocaleString()}</p>
            `;
            await sendEmail(process.env.ADMIN_EMAIL, 'New Booking Alert - Action Required', adminHtml);
          }
        }
      } catch (emailError) {
        console.error('[EMAIL] Failed to send booking emails:', emailError.message);
        if (emailError.stack) console.error(emailError.stack);
        // Don't block the response if email fails
      }

      res.json({ message: 'Payment verified successfully', success: true });
    } else {
      res.status(400).json({ message: 'Invalid payment signature', success: false });
    }
  } catch (error) {
    console.error('Razorpay Verification Error:', error);
    res.status(500).json({ message: 'Error verifying payment', error: error.message });
  }
});


router.put('/:id/pay', auth, async (req, res) => {
  try {
    const package = await Package.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }


    if (package.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Package is already paid' });
    }


    package.status = 'booked';
    package.paymentStatus = 'paid';


    await package.save();

    const populatedPackage = await Package.findById(package._id)
      .populate('stayId')
      .populate('transportationId')
      .populate('sightseeingIds');

    res.json({
      message: 'Payment successful',
      package: populatedPackage
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.get('/my-packages', auth, async (req, res) => {
  try {
    const packages = await Package.find({ userId: req.user._id })
      .populate('stayId', 'name category pricePerNight location images')
      .populate('transportationId', 'name type pricePerDay')
      .populate('sightseeingIds', 'name pricePerPerson location')
      .sort({ createdAt: -1 });

    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.get('/:id', auth, async (req, res) => {
  try {
    const package = await Package.findOne({
      _id: req.params.id,
      userId: req.user._id
    })
      .populate('stayId')
      .populate('transportationId')
      .populate('sightseeingIds');

    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    res.json(package);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.put('/:id', auth, async (req, res) => {
  try {
    const package = await Package.findOne({
      _id: req.params.id,
      userId: req.user._id,
      status: 'draft'
    });

    if (!package) {
      return res.status(404).json({ message: 'Package not found or cannot be modified' });
    }

    // Check availability if dates or components changed
    const stayId = req.body.stayId || package.stayId;
    const transportationId = req.body.transportationId || package.transportationId;
    const sightseeingIds = req.body.sightseeingIds || package.sightseeingIds;
    const checkInDate = req.body.checkInDate || package.checkInDate;
    const checkOutDate = req.body.checkOutDate || package.checkOutDate;
    const numberOfPeople = req.body.numberOfPeople || package.numberOfPeople;

    const availResult = await checkAvailability(
      stayId,
      transportationId,
      sightseeingIds,
      checkInDate,
      checkOutDate,
      numberOfPeople,
      req.params.id
    );

    if (!availResult.available) {
      return res.status(400).json({ message: availResult.message });
    }


    if (req.body.stayId || req.body.transportationId || req.body.sightseeingIds ||
      req.body.numberOfPeople || req.body.numberOfDays) {

      const stay = await Stay.findById(req.body.stayId || package.stayId);
      const transportation = await Transportation.findById(req.body.transportationId || package.transportationId);
      const sightseeing = await Sightseeing.find({
        _id: { $in: req.body.sightseeingIds || package.sightseeingIds }
      });

      const numberOfPeople = req.body.numberOfPeople || package.numberOfPeople;
      const numberOfDays = req.body.numberOfDays || package.numberOfDays;

      const stayTotal = stay ? (stay.pricePerNight * numberOfDays) : 0;
      const transportationTotal = transportation ? (transportation.pricePerDay * numberOfDays) : 0;
      const sightseeingTotal = sightseeing.reduce((total, sight) =>
        total + (sight.pricePerPerson * numberOfPeople), 0
      );
      const grandTotal = stayTotal + transportationTotal + sightseeingTotal;

      req.body.pricing = {
        stayTotal,
        transportationTotal,
        sightseeingTotal,
        grandTotal
      };
    }

    Object.assign(package, req.body);
    await package.save();

    const populatedPackage = await Package.findById(package._id)
      .populate('stayId')
      .populate('transportationId')
      .populate('sightseeingIds');

    res.json({
      message: 'Package updated successfully',
      package: populatedPackage
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const package = await Package.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    if (package.status === 'completed' || package.status === 'cancelled') {
      return res.status(400).json({ message: 'Package cannot be cancelled' });
    }

    package.status = 'cancelled';
    await package.save();

    res.json({ message: 'Package cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;