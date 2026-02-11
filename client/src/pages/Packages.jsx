import { useState, useEffect } from 'react';
import { tourPackageAPI } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { useContent } from '../context/ContentContext';

const Packages = () => {
    const { content } = useContent();
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const response = await tourPackageAPI.getTourPackages();
            setPackages(response.data);
        } catch (error) {
            console.error('Error fetching packages:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white text-black">
                { }
                <div className="relative h-[60vh] flex items-center justify-center bg-gray-100">
                    <div className="text-center px-6 w-full max-w-4xl flex flex-col items-center">
                        <SkeletonLoader height="h-16" width="w-3/4 md:w-1/2" className="mb-6 bg-gray-200" />
                        <SkeletonLoader height="h-6" width="w-full md:w-2/3" className="bg-gray-200" />
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 p-4 shadow-sm">
                                <SkeletonLoader height="h-64" className="rounded-t-2xl mb-4 bg-gray-200" />
                                <SkeletonLoader height="h-8" width="w-3/4" className="mb-4 bg-gray-200" />
                                <SkeletonLoader height="h-4" width="w-full" className="mb-2 bg-gray-200" />
                                <SkeletonLoader height="h-4" width="w-5/6" className="mb-6 bg-gray-200" />
                                <div className="flex justify-between items-center mt-4">
                                    <SkeletonLoader height="h-8" width="w-1/3" className="bg-gray-200" />
                                    <SkeletonLoader height="h-10" width="w-1/3" className="rounded-full bg-gray-200" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-black">
            { }
            <div className="relative h-[60vh] flex items-center justify-center">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: `url("${content.packages_hero_bg || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80'}")` }}
                >
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>

                <div className="relative z-10 text-center px-6">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white">
                        Curated <span className="text-gold">Journeys</span>
                    </h1>
                    <p className="text-xl text-gray-100 max-w-2xl mx-auto font-light leading-relaxed">
                        Experience the world's most breathtaking destinations with our meticulously crafted travel packages.
                    </p>
                </div>
            </div>

            {/* Packages Grid */}
            <div className="max-w-7xl mx-auto px-6 py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {packages.map((pkg) => (
                        <div key={pkg._id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gold/50 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200/50">
                            {/* Image */}
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={pkg.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80'}
                                    alt={pkg.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full border border-gray-100 shadow-sm">
                                    <span className="text-gold font-bold text-sm">{pkg.duration?.days} Days</span>
                                </div>
                            </div>

                            { }
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl font-bold text-black group-hover:text-gold transition-colors">{pkg.title}</h3>
                                </div>
                                <p className="text-gray-600 mb-6 line-clamp-2 text-sm leading-relaxed">{pkg.description}</p>

                                { }
                                <div className="flex items-center gap-6 mb-8 text-sm text-gray-500 border-t border-gray-100 pt-6">
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        <span>{pkg.destinations?.length || 1} Stops</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <span>Full Support</span>
                                    </div>
                                </div>

                                { }
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Starting From</span>
                                        <span className="text-2xl font-bold text-black">₹{pkg.price?.toLocaleString()}</span>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/packages/${pkg._id}`)}
                                        className="px-6 py-3 bg-black text-white font-medium text-sm tracking-widest uppercase hover:bg-gold hover:text-white transition-all duration-300 rounded-lg"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {packages.length === 0 && (
                    <div className="text-center py-20">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 12H4M12 20V4" /></svg>
                        <h3 className="text-2xl text-gray-900 font-medium mb-3">No Packages Found</h3>
                        <p className="text-gray-500">We are currently curating new journeys. Check back soon.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Packages;
