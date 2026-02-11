import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { packageAPI } from '../utils/api';

const BookingDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [pkg, setPkg] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPackageDetails();
    }, [id]);

    const fetchPackageDetails = async () => {
        try {
            const response = await packageAPI.getPackageDetails(id);
            setPkg(response.data);
        } catch {
            console.error('Error fetching details');
            setError('Could not load booking details.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
            try {
                await packageAPI.cancelPackage(id);
                alert('Booking cancelled successfully.');
                navigate('/dashboard');
            } catch {
                alert('Failed to cancel booking.');
            }
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            draft: 'bg-gray-100 text-gray-600',
            booked: 'bg-green-100 text-green-800',
            confirmed: 'bg-blue-100 text-blue-800',
            completed: 'bg-yellow-100 text-yellow-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-600';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
            </div>
        );
    }

    if (error || !pkg) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
                <div className="text-xl text-gray-600 mb-4">{error || 'Booking not found'}</div>
                <Link to="/dashboard" className="text-black font-bold border-b-2 border-black hover:text-gray-600">Back to Dashboard</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-24 px-4 md:px-6">
            <div className="max-w-4xl mx-auto space-y-8">

                { }
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Link to="/dashboard" className="text-sm text-gray-500 hover:text-black transition-colors flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                                Back to Dashboard
                            </Link>
                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${getStatusColor(pkg.status)}`}>
                                {pkg.status}
                            </span>
                            {pkg.paymentStatus === 'paid' && (
                                <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">Paid</span>
                            )}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-black">Booking Details</h1>
                        <p className="text-gray-500 text-sm mt-1 font-mono">ID: #{pkg._id.slice(-8).toUpperCase()}</p>
                    </div>

                    <div className="flex gap-3">
                        {pkg.status === 'draft' && (
                            <Link
                                to={`/customize?package=${pkg._id}`}
                                className="btn-unified px-6 py-2 text-xs"
                            >
                                Edit Booking
                            </Link>
                        )}
                        {pkg.status !== 'cancelled' && pkg.status !== 'completed' && (
                            <button
                                onClick={handleCancel}
                                className="px-6 py-2 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-widest hover:bg-red-50 transition-colors rounded"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    { }
                    <div className="lg:col-span-2 space-y-6">

                        { }
                        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                            <div className="h-48 relative">
                                <img
                                    src={pkg.stayId?.images?.[0] || 'https://via.placeholder.com/800x400'}
                                    alt={pkg.stayId?.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-4 left-6 text-white">
                                    <p className="text-xs font-bold uppercase opacity-80 mb-1">Accommodation</p>
                                    <h2 className="text-2xl font-bold">{pkg.stayId?.name}</h2>
                                    <p className="text-sm opacity-90">{pkg.stayId?.location}</p>
                                </div>
                            </div>
                            <div className="p-6 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500 text-xs uppercase mb-1">Check-in</p>
                                    <p className="font-bold text-black">{new Date(pkg.checkInDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase mb-1">Check-out</p>
                                    <p className="font-bold text-black">{new Date(pkg.checkOutDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase mb-1">Duration</p>
                                    <p className="font-bold text-black">{pkg.numberOfDays} Days</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs uppercase mb-1">Guests</p>
                                    <p className="font-bold text-black">{pkg.numberOfPeople} Adults</p>
                                </div>
                            </div>
                        </div>

                        { }
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold mb-4 border-b border-gray-100 pb-2">Transportation</h3>
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                    {pkg.transportationId?.images?.[0] && (
                                        <img src={pkg.transportationId.images[0]} className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-black">{pkg.transportationId?.name}</h4>
                                    <p className="text-sm text-gray-500 capitalize">{pkg.transportationId?.type?.split('_').join(' ')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Airport Transfer Section */}
                        {pkg.airportPickup && (
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <span className="bg-black text-white p-1 rounded">✈️</span> Airport Transfer
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-xs font-bold uppercase text-gray-500 mb-2">Selected Vehicles</p>
                                        <div className="space-y-3">
                                            {pkg.airportTransferDetails?.vehicles?.map((vehicle, idx) => (
                                                <div key={idx} className="flex items-start gap-4">
                                                    <div className="w-16 h-10 bg-gray-100 rounded overflow-hidden shrink-0">
                                                        <img
                                                            src={vehicle.image || 'https://via.placeholder.com/150x100?text=Vehicle'}
                                                            alt="Vehicle"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm">
                                                            {vehicle.count}x {vehicle.vehicleType}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            ₹{(vehicle.price * vehicle.count).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="pt-2 border-t mt-2">
                                                <p className="text-sm font-bold flex justify-between">
                                                    <span>Total Transfer:</span>
                                                    <span>₹{pkg.pricing?.airportTransfer?.toLocaleString() || 0}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase text-gray-500 mb-1">Arrival</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">🛬</span>
                                            <div>
                                                <p className="font-bold text-black">{pkg.airportTransferDetails?.arrivalFlight || 'N/A'}</p>
                                                <p className="text-sm text-gray-600">
                                                    {pkg.airportTransferDetails?.arrivalTime ? new Date(pkg.airportTransferDetails.arrivalTime).toLocaleString() : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase text-gray-500 mb-1">Departure</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">🛫</span>
                                            <div>
                                                <p className="font-bold text-black">{pkg.airportTransferDetails?.departureFlight || 'N/A'}</p>
                                                <p className="text-sm text-gray-600">
                                                    {pkg.airportTransferDetails?.departureTime ? new Date(pkg.airportTransferDetails.departureTime).toLocaleString() : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        { }
                        {pkg.sightseeingIds && pkg.sightseeingIds.length > 0 && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold mb-4 border-b border-gray-100 pb-2">Experiences</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {pkg.sightseeingIds.map((sight) => (
                                        <div key={sight._id} className="flex gap-3 items-center p-3 rounded-lg border border-gray-50 hover:bg-gray-50">
                                            <img src={sight.images?.[0]} className="w-12 h-12 rounded-lg object-cover" />
                                            <div>
                                                <h4 className="font-bold text-sm text-black">{sight.name}</h4>
                                                <p className="text-xs text-gray-500">{sight.duration}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    { }
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
                            <h3 className="text-lg font-serif font-bold mb-6">Price Breakdown</h3>

                            <div className="space-y-3 text-sm mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Accommodation</span>
                                    <span className="font-medium">₹{pkg.pricing?.stayTotal?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Transportation</span>
                                    <span className="font-medium">₹{pkg.pricing?.transportationTotal?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Experiences</span>
                                    <span className="font-medium">₹{pkg.pricing?.sightseeingTotal?.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4 flex justify-between items-end">
                                <span className="text-sm font-bold uppercase text-gray-500">Total</span>
                                <span className="text-2xl font-serif font-bold text-black border-b-4 border-gold/30">₹{pkg.pricing?.grandTotal?.toLocaleString()}</span>
                            </div>

                            {pkg.status === 'draft' && (
                                <Link
                                    to={`/payment/${pkg._id}`}
                                    className="block w-full mt-6 btn-unified bg-black text-white hover:bg-gold hover:text-black border-black hover:border-gold py-3 text-center"
                                >
                                    Proceed to Payment
                                </Link>
                            )}
                        </div>
                    </div>

                </div>
            </div >
        </div >
    );
};

export default BookingDetailsPage;
