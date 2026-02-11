import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userAPI } from '../utils/api';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { useContent } from '../context/ContentContext';

const CategoryPage = () => {
  const { content } = useContent();
  const { category } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stays: [],
    transportation: [],
    sightseeing: []
  });

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const [staysRes, transportRes, sightseeingRes] = await Promise.all([
          userAPI.getStaysByCategory(category),
          userAPI.getTransportation(),
          userAPI.getSightseeing()
        ]);

        setData({
          stays: staysRes.data,
          transportation: transportRes.data,
          sightseeing: sightseeingRes.data
        });
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
    window.scrollTo(0, 0);
  }, [category]);

  const getCategoryInfo = () => {
    const categoryInfo = {
      basic: {
        name: 'Basic Collection',
        budget: 'Under ₹1,500 / night',
        description: 'Essential comfort for the budget-conscious traveler.',
        image: content.category_basic_hero || 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
      },
      premium: {
        name: 'Premium Collection',
        budget: '₹1,500 - ₹3,000 / night',
        description: 'Elevated experiences with superior amenities and style.',
        image: content.category_premium_hero || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
      },
      luxury: {
        name: 'Luxury Collection',
        budget: '₹3,000+ / night',
        description: 'Unparalleled opulence and world-class service.',
        image: content.category_luxury_hero || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
      }
    };
    return categoryInfo[category] || categoryInfo.basic;
  };

  const categoryInfo = getCategoryInfo();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        { }
        <div className="relative h-[60vh] bg-black flex items-center justify-center">
          <div className="text-center w-full max-w-4xl flex flex-col items-center px-6">
            <SkeletonLoader height="h-4" width="w-48" className="mb-4 bg-gray-800" />
            <SkeletonLoader height="h-16" width="w-3/4" className="mb-6 bg-gray-800" />
            <SkeletonLoader height="h-6" width="w-1/2" className="mb-8 bg-gray-800" />
            <SkeletonLoader height="h-10" width="w-64" className="rounded-full bg-gray-800" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-10">
          { }
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100 h-32 flex items-center justify-between">
            <div className="flex-1">
              <SkeletonLoader height="h-8" width="w-1/3" className="mb-2" />
              <SkeletonLoader height="h-4" width="w-2/3" />
            </div>
            <SkeletonLoader height="h-12" width="w-48" className="rounded-none" />
          </div>

          { }
          {[1, 2, 3].map((section) => (
            <div key={section} className="mb-12">
              <div className="flex items-center gap-4 mb-8 mt-16">
                <SkeletonLoader height="h-8" width="w-64" />
                <div className="h-px bg-gray-200 flex-grow"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((card) => (
                  <div key={card} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 p-4">
                    <SkeletonLoader height="h-48" className="rounded-xl mb-4" />
                    <SkeletonLoader height="h-6" width="w-3/4" className="mb-2" />
                    <SkeletonLoader height="h-4" width="w-full" className="mb-1" />
                    <SkeletonLoader height="h-4" width="w-1/2" className="mb-4" />
                    <SkeletonLoader height="h-10" width="w-full" className="rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const SectionHeader = ({ title }) => (
    <div className="flex items-center gap-4 mb-8 mt-16">
      <h2 className="text-3xl font-serif font-bold text-black">{title}</h2>
      <div className="h-px bg-gray-200 flex-grow"></div>
    </div>
  );

  const Card = ({ item, type }) => (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="h-56 overflow-hidden relative">
        {item.images && item.images.length > 0 ? (
          <img
            src={item.images[0]}
            alt={item.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm text-black">
          {type === 'stay' ? `₹${item.pricePerNight} / night` :
            type === 'transport' ? `₹${item.pricePerDay} / day` :
              `₹${item.pricePerPerson} / person`}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-serif font-bold mb-2 text-black group-hover:text-gray-700 transition-colors">{item.name}</h3>

        <div className="space-y-2 text-sm text-gray-600 mb-6">
          {type === 'stay' && (
            <>
              <p className="flex items-center gap-2">
                <span className="text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </span> {item.location}
              </p>
              <p className="flex items-center gap-2">
                <span className="text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </span> Max {item.maxOccupancy} Guests
              </p>
            </>
          )}
          {type === 'transport' && (
            <p className="flex items-center gap-2">
              <span className="text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
              </span> {item.type.replace(/_/g, ' ')}
            </p>
          )}
          {type === 'sightseeing' && (
            <>
              <p className="flex items-center gap-2">
                <span className="text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </span> {item.location}
              </p>
              <p className="flex items-center gap-2">
                <span className="text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </span> {item.duration}
              </p>
            </>
          )}
        </div>

        <Link
          to={
            type === 'stay' ? `/stays/${item._id}` :
              type === 'transport' ? `/transport/${item._id}` :
                `/activity/${item._id}`
          }
          className="block w-full text-center py-3 border border-gray-200 rounded-lg text-sm font-medium uppercase tracking-wider text-black hover:bg-black hover:text-white transition-all duration-300"
        >
          View Details
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      { }
      <div className="relative h-[60vh] bg-black">
        <img
          src={categoryInfo.image}
          alt={categoryInfo.name}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-6 pt-20">
          <span className="text-sm font-bold uppercase tracking-[0.3em] mb-4 text-gold-500">Curated Collection</span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">{categoryInfo.name}</h1>
          <p className="text-xl md:text-2xl font-light opacity-90 max-w-2xl mx-auto mb-8 font-serif italic">
            "{categoryInfo.description}"
          </p>
          <div className="inline-block px-6 py-2 border border-white/30 rounded-full backdrop-blur-md text-sm">
            Budget Range: {categoryInfo.budget}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-10">

        { }
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-100">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-2 text-black">Ready to design your journey?</h3>
            <p className="text-gray-600">Combine these exclusive stays and activities into a custom itinerary.</p>
          </div>
          <Link to={`/customize?category=${category}`} className="btn-unified whitespace-nowrap bg-black text-white hover:bg-gray-800">
            Start Customizing Now
          </Link>
        </div>

        { }
        <SectionHeader title="Exclusive Stays" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.stays.length === 0 ? (
            <p className="col-span-full text-center py-12 text-gray-500 italic">No stays available in this collection yet.</p>
          ) : (
            data.stays.map(stay => <Card key={stay._id} item={stay} type="stay" />)
          )}
        </div>

        { }
        <SectionHeader title="Premium Transportation" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.transportation.length === 0 ? (
            <p className="col-span-full text-center py-12 text-gray-500 italic">No transportation options available in this collection yet.</p>
          ) : (
            data.transportation.map(transport => <Card key={transport._id} item={transport} type="transport" />)
          )}
        </div>

        { }
        <SectionHeader title="Curated Experiences" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.sightseeing.length === 0 ? (
            <p className="col-span-full text-center py-12 text-gray-500 italic">No curated experiences available in this collection yet.</p>
          ) : (
            data.sightseeing.map(sight => <Card key={sight._id} item={sight} type="sightseeing" />)
          )}
        </div>

      </div>
    </div>
  );
};

export default CategoryPage;