import { useState, useEffect } from 'react';
import { userAPI } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { useContent } from '../context/ContentContext';

const Destinations = () => {
    const { content } = useContent();
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDestinations();
    }, []);

    const fetchDestinations = async () => {
        try {
            
            const response = await userAPI.getDestinations();
            setDestinations(response.data);
        } catch (error) {
            console.error('Error fetching destinations:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white text-black">
                {}
                <div className="relative h-[60vh] flex items-center justify-center bg-gray-100">
                    <div className="text-center px-6 w-full max-w-4xl flex flex-col items-center">
                        <SkeletonLoader height="h-16" width="w-3/4 md:w-1/2" className="mb-6 bg-gray-200" />
                        <SkeletonLoader height="h-6" width="w-full md:w-2/3" className="bg-gray-200" />
                    </div>
                </div>

                {}
                <div className="max-w-7xl mx-auto px-6 py-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i}>
                                <SkeletonLoader height="h-[400px]" className="rounded-2xl mb-6 bg-gray-200" />
                                <SkeletonLoader height="h-8" width="w-3/4" className="mb-2 bg-gray-200" />
                                <SkeletonLoader height="h-4" width="w-1/4" className="mb-4 bg-gray-200" />
                                <SkeletonLoader height="h-4" width="w-full" className="mb-2 bg-gray-200" />
                                <SkeletonLoader height="h-4" width="w-5/6" className="bg-gray-200" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-black">
            {}
            <div className="relative h-[60vh] flex items-center justify-center">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: `url("${content.destinations_hero_bg || 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1976&q=80'}")` }}
                >
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>

                <div className="relative z-10 text-center px-6">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white">
                        Explore <span className="text-gold">Munnar</span>
                    </h1>
                    <p className="text-xl text-gray-100 max-w-2xl mx-auto font-light leading-relaxed">
                        Uncover the hidden gems and iconic vistas of this misty paradise.
                    </p>
                </div>
            </div>

            {}
            <div className="max-w-7xl mx-auto px-6 py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {destinations.map((place) => (
                        <div key={place._id} className="group cursor-pointer" onClick={() => navigate(`/activity/${place._id}`)}>
                            <div className="relative h-[400px] rounded-2xl overflow-hidden mb-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                                <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/0 transition-colors duration-500"></div>
                                <img
                                    src={place.images?.[0] || 'https://images.unsplash.com/photo-1596323497526-8806ccac9a42?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80'}
                                    alt={place.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 bg-gradient-to-t from-black via-black/70 to-transparent">
                                    <h3 className="text-3xl font-bold text-white mb-2">{place.name}</h3>
                                    <div className="flex items-center gap-2 text-gold">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        <span className="text-sm font-medium tracking-wider">{place.location || 'Munnar, Kerala'}</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-600 line-clamp-2 px-2 group-hover:text-black transition-colors">{place.description}</p>
                        </div>
                    ))}
                </div>

                {destinations.length === 0 && (
                    <div className="text-center py-20">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <h3 className="text-2xl text-gray-900 font-medium mb-3">No Destinations Found</h3>
                        <p className="text-gray-500">Explore the map to find new locations.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Destinations;
