import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { tourPackageAPI } from '../utils/api';

const PackageDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pkg, setPkg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPackage = async () => {
            try {
                const response = await tourPackageAPI.getTourPackage(id);
                setPkg(response.data);
            } catch (err) {
                console.error("Error fetching package:", err);
                setError("Failed to load package details.");
            } finally {
                setLoading(false);
            }
        };
        fetchPackage();
    }, [id]);



    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
        </div>
    );

    if (error || !pkg) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <h2 className="text-2xl font-bold">{error || "Package not found"}</h2>
            <Link to="/packages" className="border-b-2 border-black">Back to Packages</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-white text-black pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link to="/packages" className="text-gray-500 hover:text-black mb-4 inline-block text-sm uppercase tracking-widest">
                        ← Back to Packages
                    </Link>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">{pkg.title}</h1>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>{pkg.duration?.days} Days / {pkg.duration?.nights} Nights</span>
                                <span>•</span>
                                <span>{pkg.destinations?.join(', ')}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-bold text-gold">₹{pkg.price?.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">per person</p>
                        </div>
                    </div>
                </div>

                {/* Main Image */}
                <div className="h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-12 shadow-lg">
                    <img
                        src={pkg.image || 'https://via.placeholder.com/1200x600'}
                        alt={pkg.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column - Details */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Description */}
                        <div>
                            <h2 className="text-2xl font-serif font-bold mb-4">About this Trip</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">{pkg.description}</p>
                        </div>

                        {/* Inclusions */}
                        <div>
                            <h2 className="text-2xl font-serif font-bold mb-6">What's Included</h2>
                            <div className="space-y-6">
                                {pkg.stayId && (
                                    <div className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                                        <div className="w-24 h-24 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                            <img src={pkg.stayId.images?.[0]} className="w-full h-full object-cover" alt="Stay" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase text-gold mb-1">Accommodation</p>
                                            <h3 className="font-bold text-lg">{pkg.stayId.name}</h3>
                                            <p className="text-sm text-gray-600">{pkg.stayId.location}</p>
                                            <p className="text-xs text-gray-400 mt-2">{pkg.stayId.description?.substring(0, 100)}...</p>
                                        </div>
                                    </div>
                                )}

                                {pkg.transportationId && (
                                    <div className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                                        <div className="w-24 h-24 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                            <img src={pkg.transportationId.images?.[0]} className="w-full h-full object-cover" alt="Transport" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase text-gold mb-1">Transportation</p>
                                            <h3 className="font-bold text-lg">{pkg.transportationId.name}</h3>
                                            <p className="text-sm text-gray-600 capitalize">{pkg.transportationId.type}</p>
                                        </div>
                                    </div>
                                )}

                                {pkg.sightseeingIds?.length > 0 && (
                                    <div className="border border-gray-100 rounded-xl p-4">
                                        <p className="text-xs font-bold uppercase text-gold mb-4">Experiences</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {pkg.sightseeingIds.map(sight => (
                                                <div key={sight._id} className="flex gap-3 items-center">
                                                    <img src={sight.images?.[0]} className="w-12 h-12 rounded-lg object-cover" alt={sight.name} />
                                                    <div>
                                                        <h4 className="font-bold text-sm">{sight.name}</h4>
                                                        <p className="text-xs text-gray-500">{sight.duration}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                            <h3 className="text-xl font-serif font-bold mb-6">Book this Package</h3>

                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <p className="text-gray-500 text-sm">Starting from</p>
                                    <p className="text-3xl font-bold text-black">₹{pkg.price?.toLocaleString()}</p>
                                </div>
                                <span className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600">per person</span>
                            </div>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-sm text-gray-600">
                                    <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                    Instant Confirmation
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-600">
                                    <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                    Customizable Date
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-600">
                                    <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                    Best Price Guarantee
                                </li>
                            </ul>

                            <button
                                onClick={() => navigate(`/packages/${id}/book`)}
                                className="w-full py-4 bg-black text-white hover:bg-gold hover:text-black rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 block text-center"
                            >
                                Book Now
                            </button>
                            <p className="text-xs text-center text-gray-400 mt-4">Select dates on next step</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackageDetails;
