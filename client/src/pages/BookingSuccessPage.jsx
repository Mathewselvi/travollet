import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { packageAPI } from '../utils/api';

const BookingSuccessPage = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [bookingDetails, setBookingDetails] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await packageAPI.getPackageDetails(id);
                setBookingDetails(response.data);
            } catch (error) {
                console.error("Failed to fetch booking details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
            <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden text-center relative">
                <div className="bg-black/5 h-2 w-full absolute top-0"></div>

                <div className="p-10 space-y-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <div>
                        <span className="text-gold text-xs font-bold uppercase tracking-[0.2em] block mb-2">Payment Successful</span>
                        <h1 className="text-3xl font-serif font-bold text-black mb-2">Journey Confirmed!</h1>
                        <p className="text-gray-500">
                            Your custom itinerary has been secured. Get ready for an unforgettable experience.
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 text-left space-y-3">
                        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Booking Reference</span>
                            <span className="font-mono text-sm font-bold text-black select-all">#{id.slice(-8).toUpperCase()}</span>
                        </div>

                        {bookingDetails && (
                            <>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Total Paid</span>
                                    <span className="font-bold text-black">₹{bookingDetails.pricing.grandTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Travelers</span>
                                    <span className="font-bold text-black">{bookingDetails.numberOfPeople} People</span>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="pt-4 flex flex-col gap-3">
                        <Link
                            to="/dashboard"
                            className="w-full btn-unified bg-black text-white hover:bg-gold hover:text-black border-black hover:border-gold py-4 text-center rounded-xl"
                        >
                            View My Bookings
                        </Link>
                        <Link
                            to="/"
                            className="text-sm text-gray-500 hover:text-black transition-colors"
                        >
                            Return to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccessPage;
