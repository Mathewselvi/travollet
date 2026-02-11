import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userAPI } from '../utils/api';
import { useTrip } from '../context/TripContext';
import SkeletonLoader from '../components/common/SkeletonLoader';

const ActivityDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const { addActivity } = useTrip();

    const handleAddToTrip = () => {
        addActivity(activity);
        alert('Experience added to your trip!');
        navigate(-1);
    };


    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await userAPI.getSightseeingDetails(id);
                setActivity(res.data);
            } catch (error) {
                console.error('Error fetching activity details:', error);
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
                            <SkeletonLoader height="h-16" width="w-3/4" className="mb-4 bg-gray-300" />
                            <SkeletonLoader height="h-8" width="w-1/2" className="bg-gray-300" />
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        <div>
                            <SkeletonLoader height="h-10" width="w-48" className="mb-6" />
                            <SkeletonLoader height="h-4" width="w-full" className="mb-2" />
                            <SkeletonLoader height="h-4" width="w-2/3" />
                        </div>
                        <div>
                            <SkeletonLoader height="h-8" width="w-32" className="mb-6" />
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <SkeletonLoader key={i} height="h-8" className="rounded-lg" />
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

    if (!activity) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black">
                <h2 className="text-2xl font-serif font-bold mb-4">Experience Not Found</h2>
                <button onClick={() => navigate(-1)} className="btn-unified">Go Back</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {}
            <div className="h-[60vh] md:h-[70vh] relative">
                <img
                    src={activity.images[activeImage] || 'https://via.placeholder.com/1920x1080'}
                    alt={activity.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">{activity.name}</h1>
                        <div className="flex flex-wrap gap-4 text-lg font-light opacity-90">
                            <span className="flex items-center gap-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> {activity.location}</span>
                            <span className="border-l border-white/40 pl-4 flex items-center gap-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> {activity.duration}</span>
                        </div>
                    </div>
                </div>
            </div>

            {}
            {activity.images.length > 1 && (
                <div className="bg-black py-4 overflow-x-auto">
                    <div className="max-w-7xl mx-auto px-6 flex gap-4">
                        {activity.images.map((img, idx) => (
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
                        <h2 className="text-3xl font-serif font-bold mb-6 text-black">Experience Overview</h2>
                        <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                            {activity.description}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-2xl font-serif font-bold mb-6 text-black">Highlights</h3>
                        <div className="space-y-4">
                            {(Array.isArray(activity.highlights) ? activity.highlights : [])
                                .flatMap(item => typeof item === 'string' && item.includes(',') ? item.split(',') : item)
                                .map(item => (typeof item === 'string' ? item.trim() : item))
                                .filter(item => item)
                                .map((highlight, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <span className="text-gold-500 mt-1">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                        </span>
                                        <span className="text-gray-700 text-lg">{highlight}</span>
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-2xl font-serif font-bold mb-6 text-black">What's Included</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(Array.isArray(activity.included) ? activity.included : [])
                                .flatMap(item => typeof item === 'string' && item.includes(',') ? item.split(',') : item)
                                .map(item => (typeof item === 'string' ? item.trim() : item))
                                .filter(item => item)
                                .map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                                        <span className="text-green-600">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                        </span>
                                        <span className="text-gray-700 font-medium">{item}</span>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-8 shadow-xl">
                        <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-6">
                            <div>
                                <span className="text-sm text-gray-500 uppercase tracking-wider block mb-1">Price per Person</span>
                                <span className="text-3xl font-bold text-black">₹{activity.pricePerPerson.toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleAddToTrip}
                            className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest hover:bg-gold hover:text-black hover:border-gold border border-black transition-all rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            Add to Your Trip
                        </button>

                        <p className="text-xs text-center text-gray-400 mt-4">
                            *Group discounts may apply
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityDetails;
