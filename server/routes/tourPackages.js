const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const TourPackage = require('../models/TourPackage');
const Package = require('../models/Package');
const { checkAvailability } = require('../utils/availability');
const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const packages = await TourPackage.find({ isActive: true })
            .populate('stayId')
            .populate('transportationId')
            .populate('sightseeingIds');
        res.json(packages);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


router.get('/admin', auth, async (req, res) => {
    try {





        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const packages = await TourPackage.find()
            .populate('stayId')
            .populate('transportationId')
            .populate('sightseeingIds')
            .sort({ createdAt: -1 });
        res.json(packages);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const tourPackage = await TourPackage.findById(req.params.id)
            .populate('stayId')
            .populate('transportationId')
            .populate('sightseeingIds');

        if (!tourPackage) {
            return res.status(404).json({ message: 'Package not found' });
        }
        res.json(tourPackage);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const newPackage = new TourPackage(req.body);
        await newPackage.save();
        res.status(201).json(newPackage);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


router.put('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const updatedPackage = await TourPackage.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedPackage) {
            return res.status(404).json({ message: 'Package not found' });
        }

        res.json(updatedPackage);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


router.delete('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const deletedPackage = await TourPackage.findByIdAndDelete(req.params.id);

        if (!deletedPackage) {
            return res.status(404).json({ message: 'Package not found' });
        }

        res.json({ message: 'Package deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Book a tour package
router.post('/:id/book', auth, async (req, res) => {
    try {
        const { checkInDate, numberOfPeople } = req.body;
        const tourPackage = await TourPackage.findById(req.params.id);

        if (!tourPackage) {
            return res.status(404).json({ message: 'Tour Package not found' });
        }

        if (!tourPackage.isActive) {
            return res.status(400).json({ message: 'This package is not currently available' });
        }

        const grandTotal = tourPackage.price * numberOfPeople;

        // Calculate end date based on duration
        const checkOutDate = new Date(checkInDate);
        checkOutDate.setDate(checkOutDate.getDate() + tourPackage.duration.days);

        // Check availability before booking
        const availResult = await checkAvailability(
            tourPackage.stayId,
            tourPackage.transportationId,
            tourPackage.sightseeingIds,
            checkInDate,
            checkOutDate.toISOString().split('T')[0],
            numberOfPeople
        );

        if (!availResult.available) {
            return res.status(400).json({ message: availResult.message });
        }

        const newBooking = new Package({
            userId: req.user._id,
            stayId: tourPackage.stayId, // Assumes stayId is present. If optional in TourPackage, need check.
            transportationId: tourPackage.transportationId,
            sightseeingIds: tourPackage.sightseeingIds,
            numberOfPeople,
            numberOfDays: tourPackage.duration.days,
            checkInDate,
            checkOutDate,
            pricing: {
                stayTotal: grandTotal, // Assigning full price here to satisfy schema
                transportationTotal: 0,
                sightseeingTotal: 0,
                grandTotal: grandTotal
            },
            status: 'booked', // Or 'draft' depending on flow. 'booked' seems appropriate for "Book Now".
            paymentStatus: 'pending'
        });

        // Handle case where stayId might be missing in TourPackage but required in Package
        if (!newBooking.stayId) {
            // If TourPackage doesn't have a stay, we can't create a Package easily given the schema.
            // We'll search for a placeholder Stay or error. 
            // EDIT: For now, assuming data integrity or we'll fail. 
            // Actually, let's just fail if stayId is missing as Package requires it.
            return res.status(400).json({ message: 'This tour package is invalid (missing accommodation).' });
        }

        await newBooking.save();

        res.status(201).json(newBooking);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
