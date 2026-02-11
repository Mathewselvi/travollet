import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { tourPackageAPI, packageAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const PackageBooking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useAuth();
    const [pkg, setPkg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [guests, setGuests] = useState(1);
    const [isAvailable, setIsAvailable] = useState(null);
    const [checkingAvailability, setCheckingAvailability] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const fetchPackage = async () => {
            try {
                const response = await tourPackageAPI.getTourPackage(id);
                setPkg(response.data);
            } catch (err) {
                console.error("Error fetching package:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPackage();
    }, [id]);

    const checkAvailability = async (date, currentGuests = guests) => {
        if (!pkg?.stayId || !date) return true;

        setCheckingAvailability(true);
        setIsAvailable(null);

        try {
            const start = new Date(date);
            const duration = pkg.duration?.days || 1;

            // Basic client-side check against unavailable dates array if present
            const unavailableDates = pkg.stayId.unavailableDates?.map(d => new Date(d).toDateString()) || [];
            let current = new Date(start);
            let foundConflict = false;

            for (let i = 0; i < duration; i++) {
                if (unavailableDates.includes(current.toDateString())) {
                    foundConflict = true;
                    break;
                }
                current.setDate(current.getDate() + 1);
            }

            if (foundConflict) {
                setIsAvailable(false);
            } else {
                // Call server API for full inventory check
                const checkRes = await packageAPI.checkAvailability({
                    stayId: pkg.stayId._id,
                    transportationId: pkg.transportationId?._id,
                    sightseeingIds: pkg.sightseeingIds?.map(s => s._id),
                    checkInDate: date,
                    checkOutDate: new Date(new Date(date).getTime() + (pkg.duration?.days || 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    numberOfPeople: currentGuests
                });
                setIsAvailable(checkRes.data.available);
            }

        } catch (err) {
            console.error("Availability check failed:", err);
            setIsAvailable(false);
        } finally {
            setCheckingAvailability(false);
        }
    };

    const handleDateChange = (e) => {
        const date = e.target.value;
        setStartDate(date);
        checkAvailability(date);
    };

    const handleProceed = async () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: location } });
            return;
        }

        if (!startDate) return alert("Please select a start date.");
        if (isAvailable === false) return alert("Selected dates are not available.");

        setProcessing(true);
        try {
            const bookingData = {
                packageId: pkg._id,
                checkInDate: startDate,
                numberOfPeople: guests
            };
            const response = await tourPackageAPI.bookTourPackage(bookingData);
            // Navigate to Payment Page
            navigate(`/payment/${response.data._id}`);
        } catch (err) {
            console.error("Booking failed:", err);
            alert(err.response?.data?.message || "Booking failed. Please try again.");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
        </div>
    );

    if (!pkg) return <div className="min-h-screen flex items-center justify-center">Package not found</div>;

    return (
        <div className="min-h-screen bg-white text-black pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-3xl mx-auto">
                <Link to={`/packages/${id}`} className="text-gray-500 hover:text-black mb-6 inline-block text-sm uppercase tracking-widest">
                    ← Back to Details
                </Link>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-black p-8 text-center">
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">Plan Your Journey</h1>
                        <p className="text-gray-400">Finalize details for {pkg.title}</p>
                    </div>

                    <div className="p-8 md:p-12 space-y-8">
                        <div>
                            <label className="block text-sm font-bold uppercase text-gray-500 mb-3">When do you want to go?</label>
                            <input
                                type="date"
                                className="w-full p-4 rounded-xl border border-gray-200 focus:border-black outline-none transition-colors text-lg"
                                min={new Date().toISOString().split('T')[0]}
                                value={startDate}
                                onChange={handleDateChange}
                            />
                            {checkingAvailability && <p className="text-sm text-gray-500 mt-2">Checking availability...</p>}
                            {!checkingAvailability && startDate && isAvailable === true && (
                                <p className="text-sm text-green-600 mt-2 font-bold flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                    Available
                                </p>
                            )}
                            {!checkingAvailability && startDate && isAvailable === false && (
                                <p className="text-sm text-red-600 mt-2 font-bold flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                    Not Available
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold uppercase text-gray-500 mb-3">Who is traveling?</label>
                            <div className="relative">
                                <select
                                    value={guests}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        setGuests(val);
                                        if (startDate) checkAvailability(startDate, val);
                                    }}
                                    className="w-full p-4 rounded-xl border border-gray-200 focus:border-black outline-none appearance-none text-lg bg-white"
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                                        <option key={n} value={n}>{n} Traveller{n > 1 ? 's' : ''}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-gray-500 text-lg">Total Price</span>
                                <div className="text-right">
                                    <span className="block text-3xl font-bold text-black">₹{(pkg.price * guests).toLocaleString()}</span>
                                    <span className="text-sm text-gray-400">for {guests} person{guests > 1 ? 's' : ''}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleProceed}
                                disabled={(!isAuthenticated) ? false : (!startDate || isAvailable === false || processing)}
                                className={`w-full py-5 rounded-xl font-bold uppercase tracking-widest text-lg transition-all shadow-lg hover:shadow-xl ${(!isAuthenticated) || (startDate && isAvailable !== false && !processing)
                                    ? 'bg-black text-white hover:bg-gold hover:text-black transform hover:-translate-y-1'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {isAuthenticated ? (processing ? 'Processing...' : 'Proceed to Payment') : 'Login to Continue'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackageBooking;
