import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userAPI } from '../utils/api';
import { useTrip } from '../context/TripContext';
import SkeletonLoader from '../components/common/SkeletonLoader';

const StayDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [stay, setStay] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);


    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(1);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await userAPI.getStayDetails(id);
                setStay(res.data);
            } catch (error) {
                console.error('Error fetching stay details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
        window.scrollTo(0, 0);
    }, [id]);

    const { addStay } = useTrip();

    const handleAddToTrip = () => {


        addStay(stay);




        alert('Stay added to your trip!');
        navigate(-1);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <div className="h-[60vh] md:h-[70vh] bg-gray-200 animate-pulse relative">
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
                        <div className="max-w-7xl mx-auto">
                            <SkeletonLoader height="h-16" width="w-3/4" className="mb-4 bg-gray-300" />
                            <SkeletonLoader height="h-8" width="w-1/3" className="bg-gray-300" />
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        <div>
                            <SkeletonLoader height="h-10" width="w-48" className="mb-6" />
                            <SkeletonLoader height="h-4" width="w-full" className="mb-2" />
                            <SkeletonLoader height="h-4" width="w-full" className="mb-2" />
                            <SkeletonLoader height="h-4" width="w-2/3" />
                        </div>
                        <div>
                            <SkeletonLoader height="h-8" width="w-32" className="mb-6" />
                            <div className="grid grid-cols-3 gap-4">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <SkeletonLoader key={i} height="h-12" className="rounded-xl" />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <SkeletonLoader height="h-64" className="rounded-2xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (!stay) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black">
                <h2 className="text-2xl font-serif font-bold mb-4">Stay Not Found</h2>
                <button onClick={() => navigate(-1)} className="btn-unified">Go Back</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            { }
            <div className="h-[60vh] md:h-[70vh] relative">
                <img
                    src={stay.images[activeImage] || 'https://via.placeholder.com/1920x1080'}
                    alt={stay.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">{stay.name}</h1>
                        <p className="text-xl md:text-2xl font-light opacity-90 flex items-center gap-2">
                            <span><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></span> {stay.location}
                        </p>
                    </div>
                </div>
            </div>

            { }
            {stay.images.length > 1 && (
                <div className="bg-black py-4 overflow-x-auto">
                    <div className="max-w-7xl mx-auto px-6 flex gap-4">
                        {stay.images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(idx)}
                                className={`flex-shrink-0 w-24 h-16 md:w-32 md:h-20 border-2 rounded-lg overflow-hidden transition-all ${activeImage === idx ? 'border-white opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                                    }`}
                            >
                                <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            { }
            <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-3 gap-12">

                { }
                <div className="lg:col-span-2 space-y-12">
                    <div>
                        <h2 className="text-3xl font-serif font-bold mb-6 text-black">About this Stay</h2>
                        <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                            {stay.description}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-2xl font-serif font-bold mb-6 text-black">Amenities</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {(Array.isArray(stay.amenities) ? stay.amenities : [])
                                .flatMap(item => typeof item === 'string' && item.includes(',') ? item.split(',') : item)
                                .map(item => (typeof item === 'string' ? item.trim() : item))
                                .filter(item => item)
                                .map((amenity, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <span className="text-gold-500">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                        </span>
                                        <span className="text-gray-700 font-medium">{amenity}</span>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>

                { }
                <div className="lg:col-span-1">
                    <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-8 shadow-xl">
                        <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-6">
                            <div>
                                <span className="text-sm text-gray-500 uppercase tracking-wider block mb-1">Price per night</span>
                                <span className="text-3xl font-bold text-black">₹{stay.pricePerNight.toLocaleString()}</span>
                            </div>
                            <div className="text-right">
                                <span className="block text-sm text-gray-500">Max</span>
                                <span className="font-medium text-black">{stay.maxOccupancy} Guests</span>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Check-in</label>
                                    <input
                                        type="date"
                                        className="w-full border border-gray-300 rounded p-2 text-sm"
                                        value={checkIn}
                                        onChange={(e) => setCheckIn(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Check-out</label>
                                    <input
                                        type="date"
                                        className="w-full border border-gray-300 rounded p-2 text-sm"
                                        value={checkOut}
                                        onChange={(e) => setCheckOut(e.target.value)}
                                        min={checkIn || new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Guests</label>
                                <input
                                    type="number"
                                    className="w-full border border-gray-300 rounded p-2 text-sm"
                                    min="1"
                                    max={stay.maxOccupancy}
                                    value={guests}
                                    onChange={(e) => setGuests(parseInt(e.target.value))}
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleAddToTrip}
                            className={`w-full py-4 bg-black text-white font-bold uppercase tracking-widest hover:bg-gold hover:text-black hover:border-gold border border-black transition-all rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
                        >
                            Add to Your Trip
                        </button>

                        <p className="text-xs text-center text-gray-400 mt-4">
                            *Taxes and fees calculated at checkout
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StayDetails;
