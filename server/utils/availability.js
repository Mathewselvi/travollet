const Package = require('../models/Package');
const Stay = require('../models/Stay');
const Transportation = require('../models/Transportation');
const Sightseeing = require('../models/Sightseeing');

const checkAvailability = async (stayId, transportationId, sightseeingIds, checkIn, checkOut, numberOfPeople, excludePackageId = null) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    console.log(`[AVAIL] Checking: Stay=${stayId}, Transport=${transportationId}, People=${numberOfPeople}, Range=${checkIn} to ${checkOut}`);

    // 1. Check Stay Availability
    const stay = await Stay.findById(stayId);
    if (!stay) {
        console.log(`[AVAIL] Stay ${stayId} not found`);
        throw new Error('Stay not found');
    }

    // Check manual blocked dates
    const isStayBlocked = (stay.unavailableDates || []).some(date => {
        const d = new Date(date);
        return d >= start && d < end;
    });
    if (isStayBlocked) {
        console.log(`[AVAIL] Stay ${stay.name} is blocked for selected dates`);
        return { available: false, message: `${stay.name} is blocked for selected dates.` };
    }

    const overlappingStayBookings = await Package.countDocuments({
        _id: { $ne: excludePackageId },
        stayId,
        status: { $in: ['booked', 'confirmed', 'completed', 'paid'] },
        checkInDate: { $lt: end },
        checkOutDate: { $gt: start }
    });

    if (overlappingStayBookings >= (stay.totalRooms || 1)) {
        console.log(`[AVAIL] Stay ${stay.name} fully booked: ${overlappingStayBookings}/${stay.totalRooms || 1}`);
        return { available: false, message: `No rooms available at ${stay.name} for selected dates.` };
    }

    // 2. Check Transportation Availability
    if (transportationId) {
        const transport = await Transportation.findById(transportationId);
        if (!transport) {
            console.log(`[AVAIL] Transportation ${transportationId} not found`);
            throw new Error('Transportation not found');
        }

        const isTransportBlocked = (transport.unavailableDates || []).some(date => {
            const d = new Date(date);
            return d >= start && d < end;
        });
        if (isTransportBlocked) {
            console.log(`[AVAIL] Transportation ${transport.name} is blocked`);
            return { available: false, message: `${transport.name} is blocked for selected dates.` };
        }

        const overlappingTransportBookings = await Package.countDocuments({
            _id: { $ne: excludePackageId },
            transportationId,
            status: { $in: ['booked', 'confirmed', 'completed', 'paid'] },
            checkInDate: { $lt: end },
            checkOutDate: { $gt: start }
        });

        if (overlappingTransportBookings >= (transport.totalQuantity || 1)) {
            console.log(`[AVAIL] Transportation ${transport.name} fully booked: ${overlappingTransportBookings}/${transport.totalQuantity || 1}`);
            return { available: false, message: `${transport.name} is fully booked for selected dates.` };
        }
    }

    // 3. Check Sightseeing Availability (per day slots)
    if (sightseeingIds && sightseeingIds.length > 0) {
        for (const sId of sightseeingIds) {
            const sight = await Sightseeing.findById(sId);
            if (!sight) continue;

            // Check each day in range
            const sightseeingStart = new Date(start);
            const sightseeingEnd = new Date(end);

            for (let d = new Date(sightseeingStart); d < sightseeingEnd; d.setDate(d.getDate() + 1)) {
                const dayStart = new Date(d);
                dayStart.setHours(0, 0, 0, 0);
                const dayEnd = new Date(d);
                dayEnd.setHours(23, 59, 59, 999);

                const bookingsThatDay = await Package.find({
                    _id: { $ne: excludePackageId },
                    sightseeingIds: sId,
                    status: { $in: ['booked', 'confirmed', 'completed', 'paid'] },
                    checkInDate: { $lt: dayEnd },
                    checkOutDate: { $gt: dayStart }
                });

                const totalPeople = bookingsThatDay.reduce((sum, b) => sum + (b.numberOfPeople || 0), 0);
                if (totalPeople + numberOfPeople > (sight.maxSlotsPerDay || 50)) {
                    console.log(`[AVAIL] Sightseeing ${sight.name} capacity reached on ${d}`);
                    return { available: false, message: `Sightseeing capacity reached for ${sight.name} on ${new Date(d).toLocaleDateString()}` };
                }
            }
        }
    }

    console.log(`[AVAIL] SUCCESS for Stay: ${stayId}`);
    return { available: true };
};

module.exports = { checkAvailability };
