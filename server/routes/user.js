const express = require('express');
const { auth } = require('../middleware/auth');
const Stay = require('../models/Stay');
const Transportation = require('../models/Transportation');
const Sightseeing = require('../models/Sightseeing');
const Destination = require('../models/Destination');
const Package = require('../models/Package');

const AirportTransfer = require('../models/AirportTransfer');

const router = express.Router();


const isAvailable = (item, start, end) => {
  if (!item.unavailableDates || item.unavailableDates.length === 0) return true;
  if (!start || !end) return true;

  const startDate = new Date(start);
  const endDate = new Date(end);

  return !item.unavailableDates.some(date => {
    const d = new Date(date);
    return d >= startDate && d < endDate;
  });
};


router.get('/stays/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { checkIn, checkOut, guests } = req.query;

    if (!['basic', 'premium', 'luxury'].includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    let query = {
      category,
      isActive: true
    };

    if (guests) {
      query.maxOccupancy = { $gte: parseInt(guests) };
    }

    const stays = await Stay.find(query).sort({ pricePerNight: 1 });



    let availableStays = checkIn && checkOut
      ? stays.filter(stay => isAvailable(stay, checkIn, checkOut))
      : stays;


    if (checkIn && checkOut && availableStays.length > 0) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);

      console.log(`[AVAIL CHECK] CheckIn: ${start}, CheckOut: ${end}`);

      // Get all overlapping bookings
      const overlappingBookings = await Package.find({
        status: { $in: ['booked', 'confirmed', 'completed', 'paid'] },
        checkInDate: { $lt: end },
        checkOutDate: { $gt: start }
      }).select('stayId');

      console.log(`[AVAIL CHECK] Overlapping Bookings Found: ${overlappingBookings.length}`);

      const stayBookingCounts = overlappingBookings.reduce((acc, b) => {
        if (b.stayId) {
          acc[b.stayId.toString()] = (acc[b.stayId.toString()] || 0) + 1;
        }
        return acc;
      }, {});

      console.log(`[AVAIL CHECK] Booking Counts:`, stayBookingCounts);

      availableStays = availableStays.filter(stay => {
        const bookedCount = stayBookingCounts[stay._id.toString()] || 0;
        const totalRooms = stay.totalRooms || 1;

        if (bookedCount >= totalRooms) {
          console.log(`[AVAIL CHECK] Filtering out stay ${stay.name} (${stay._id}). Booked: ${bookedCount}, Total: ${totalRooms}`);
          return false;
        }
        return true;
      });
    }

    res.json(availableStays);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.get('/transportation', async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;

    const transportation = await Transportation.find({
      isActive: true
    }).sort({ pricePerDay: 1 });


    let availableTransport = checkIn && checkOut
      ? transportation.filter(t => isAvailable(t, checkIn, checkOut))
      : transportation;


    if (checkIn && checkOut && availableTransport.length > 0) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);

      const overlappingBookings = await Package.find({
        status: { $in: ['booked', 'confirmed', 'completed', 'paid'] },
        transportationId: { $ne: null },
        checkInDate: { $lt: end },
        checkOutDate: { $gt: start }
      }).select('transportationId');

      const transportBookingCounts = overlappingBookings.reduce((acc, b) => {
        acc[b.transportationId.toString()] = (acc[b.transportationId.toString()] || 0) + 1;
        return acc;
      }, {});

      availableTransport = availableTransport.filter(t => {
        const bookedCount = transportBookingCounts[t._id.toString()] || 0;
        return bookedCount < (t.totalQuantity || 1);
      });
    }

    res.json(availableTransport);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.get('/sightseeing', async (req, res) => {
  try {
    const { checkIn, checkOut } = req.query;

    const sightseeing = await Sightseeing.find({
      isActive: true
    }).sort({ pricePerPerson: 1 });


    let availableSightseeing = checkIn && checkOut
      ? sightseeing.filter(s => isAvailable(s, checkIn, checkOut))
      : sightseeing;











    if (checkIn && checkOut && availableSightseeing.length > 0) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const requestedPeople = parseInt(req.query.guests) || 1;

      // Sightseeing is more complex because it's per day capacity
      // We'll filter each sightseeing option
      const filteredSightseeing = [];

      for (const sight of availableSightseeing) {
        let isFullyAvailable = true;

        // Loop through each day of the request
        for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
          const dayStart = new Date(d);
          dayStart.setHours(0, 0, 0, 0);
          const dayEnd = new Date(d);
          dayEnd.setHours(23, 59, 59, 999);

          const bookingsThatDay = await Package.find({
            status: { $in: ['booked', 'confirmed', 'completed', 'paid'] },
            sightseeingIds: sight._id,
            checkInDate: { $lt: dayEnd },
            checkOutDate: { $gt: dayStart }
          }).select('numberOfPeople');

          const totalPeopleBooked = bookingsThatDay.reduce((sum, b) => sum + (b.numberOfPeople || 0), 0);
          if (totalPeopleBooked + requestedPeople > (sight.maxSlotsPerDay || 50)) {
            isFullyAvailable = false;
            break;
          }
        }

        if (isFullyAvailable) {
          filteredSightseeing.push(sight);
        }
      }
      availableSightseeing = filteredSightseeing;
    }

    res.json(availableSightseeing);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.get('/destinations', async (req, res) => {
  try {
    const destinations = await Destination.find({
      isActive: true
    }).sort({ createdAt: -1 });

    res.json(destinations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.get('/stays/details/:id', async (req, res) => {
  try {
    const stay = await Stay.findOne({
      _id: req.params.id,
      isActive: true
    });

    if (!stay) {
      return res.status(404).json({ message: 'Stay not found' });
    }

    res.json(stay);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.get('/transportation/details/:id', async (req, res) => {
  try {
    const transportation = await Transportation.findOne({
      _id: req.params.id,
      isActive: true
    });

    if (!transportation) {
      return res.status(404).json({ message: 'Transportation not found' });
    }

    res.json(transportation);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.get('/sightseeing/details/:id', async (req, res) => {
  try {
    const sightseeing = await Sightseeing.findOne({
      _id: req.params.id,
      isActive: true
    });

    if (!sightseeing) {
      return res.status(404).json({ message: 'Sightseeing not found' });
    }

    res.json(sightseeing);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.post('/calculate-price', async (req, res) => {
  try {
    const { stayId, transportationId, sightseeingIds, numberOfPeople, numberOfDays } = req.body;


    const stay = await Stay.findById(stayId);
    if (!stay || !stay.isActive) {
      return res.status(404).json({ message: 'Stay not found' });
    }


    const transportation = await Transportation.findById(transportationId);
    if (!transportation || !transportation.isActive) {
      return res.status(404).json({ message: 'Transportation not found' });
    }


    const sightseeing = await Sightseeing.find({
      _id: { $in: sightseeingIds },
      isActive: true
    });


    const stayTotal = stay.pricePerNight * numberOfDays;
    const transportationTotal = transportation.pricePerDay * numberOfDays;
    const sightseeingTotal = sightseeing.reduce((total, sight) =>
      total + (sight.pricePerPerson * numberOfPeople), 0
    );
    const grandTotal = stayTotal + transportationTotal + sightseeingTotal;

    res.json({
      pricing: {
        stayTotal,
        transportationTotal,
        sightseeingTotal,
        grandTotal
      },
      breakdown: {
        stay: `₹${stay.pricePerNight} × ${numberOfDays} days = ₹${stayTotal}`,
        transportation: `₹${transportation.pricePerDay} × ${numberOfDays} days = ₹${transportationTotal}`,
        sightseeing: `Total for ${numberOfPeople} people = ₹${sightseeingTotal}`,
        total: `₹${grandTotal}`
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.get('/airport-transfers', async (req, res) => {
  try {
    const transfers = await AirportTransfer.find({ isActive: true }).sort({ price: 1 });
    res.json(transfers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;