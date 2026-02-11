import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userAPI } from '../utils/api';
import { useTrip } from '../context/TripContext';
import SkeletonLoader from '../components/common/SkeletonLoader';

const TransportDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [transport, setTransport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const { addTransportation } = useTrip();

    const handleAddToTrip = () => {
        addTransportation(transport);
        alert('Transportation added to your trip!');
        navigate(-1);
    };


    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await userAPI.getTransportationDetails(id);
                setTransport(res.data);
            } catch (error) {
                console.error('Error fetching transport details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <div className="h-[60vh] md:h-[70vh] bg-gray-200 animate-pulse relative">
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
                        <div className="max-w-7xl mx-auto">
                            <SkeletonLoader height="h-8" width="w-32" className="mb-4 bg-gray-300 rounded-full" />
                            <SkeletonLoader height="h-16" width="w-3/4" className="mb-4 bg-gray-300" />
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
                                {[1, 2, 3].map(i => (
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

    if (!transport) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black">
                <h2 className="text-2xl font-serif font-bold mb-4">Vehicle Not Found</h2>
                <button onClick={() => navigate(-1)} className="btn-unified">Go Back</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {}
            <div className="h-[60vh] md:h-[70vh] relative">
                <img
                    src={transport.images[activeImage] || 'https://via.placeholder.com/1920x1080'}
                    alt={transport.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/30">
                            {transport.type.replace(/_/g, ' ')}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">{transport.name}</h1>
                    </div>
                </div>
            </div>

            {}
            {transport.images.length > 1 && (
                <div className="bg-black py-4 overflow-x-auto">
                    <div className="max-w-7xl mx-auto px-6 flex gap-4">
                        {transport.images.map((img, idx) => (
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

            {}
            <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-3 gap-12">

                {}
                <div className="lg:col-span-2 space-y-12">
                    <div>
                        <h2 className="text-3xl font-serif font-bold mb-6 text-black">Vehicle Overview</h2>
                        <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                            {transport.description}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-2xl font-serif font-bold mb-6 text-black">Features</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {(Array.isArray(transport.features) ? transport.features : [])
                                .flatMap(item => typeof item === 'string' && item.includes(',') ? item.split(',') : item)
                                .map(item => (typeof item === 'string' ? item.trim() : item))
                                .filter(item => item)
                                .map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <span className="text-gold-500">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                        </span>
                                        <span className="text-gray-700 font-medium">{feature}</span>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-8 shadow-xl">
                        <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-6">
                            <div>
                                <span className="text-sm text-gray-500 uppercase tracking-wider block mb-1">Daily Rate</span>
                                <span className="text-3xl font-bold text-black">₹{transport.pricePerDay.toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleAddToTrip}
                            className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest hover:bg-gold hover:text-black hover:border-gold border border-black transition-all rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            Add to Your Trip
                        </button>

                        <p className="text-xs text-center text-gray-400 mt-4">
                            *Insurance included in base price
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransportDetails;
