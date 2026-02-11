import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { packageAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

import UserChatPanel from '../components/UserChatPanel';

const UserDashboard = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('journeys');
  const { user } = useAuth();

  useEffect(() => {
    fetchUserPackages();
  }, []);

  const fetchUserPackages = async () => {
    try {
      const response = await packageAPI.getUserPackages();

      setPackages(response.data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPackage = async (packageId) => {
    if (window.confirm('Are you sure you want to cancel this journey?')) {
      try {
        await packageAPI.cancelPackage(packageId);
        fetchUserPackages();
      } catch {
        alert('Error cancelling package');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-200 text-gray-700',
      booked: 'bg-green-100 text-green-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-200 text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl font-light tracking-widest text-gray-500">LOADING YOUR JOURNEYS...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">

        { }
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-gray-200 pb-8">
          <div>
            <h5 className="text-gray-500 uppercase tracking-widest text-sm mb-2">My Dashboard</h5>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-black">
              Welcome back, <br /> <span className="opacity-70">{user?.name}</span>
            </h1>
          </div>
          <Link to="/" className="btn-unified mt-6 md:mt-0">
            Create New Journey
          </Link>
        </div>

        { }
        <div className="flex space-x-8 mb-10 border-b border-gray-200 overflow-x-auto hide-scrollbar whitespace-nowrap">
          <button
            onClick={() => setActiveTab('journeys')}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 ${activeTab === 'journeys' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
          >
            My Journeys
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 ${activeTab === 'messages' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
          >
            Messages
          </button>
        </div>

        { }
        { }
        {activeTab === 'journeys' && (
          <div className="mb-20 animate-fade-in-up">

            { }
            {packages.length === 0 && (
              <div className="mb-16">
                <div className="bg-black rounded-3xl p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-2xl">
                  <div className="relative z-10 max-w-xl">
                    <span className="text-gold font-bold tracking-widest text-xs uppercase mb-2 block">Welcome to Travollet</span>
                    <h2 className="text-3xl font-serif font-bold text-white mb-4">Start Planning with an Expert</h2>
                    <p className="text-gray-400 mb-8 text-lg">
                      Not sure where to go? Chat with our travel concierge to build your dream itinerary from scratch.
                    </p>
                    <button
                      onClick={() => setActiveTab('messages')}
                      className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gold transition-colors"
                    >
                      Start Conversation
                    </button>
                  </div>
                  <div className="hidden md:block absolute right-0 bottom-0 text-white/5 transform translate-x-1/4 translate-y-1/4">
                    <svg className="w-96 h-96" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" /></svg>
                  </div>
                </div>
              </div>
            )}

            <h2 className="text-2xl font-serif font-bold mb-8 flex items-center">
              Your Journeys
              <span className="ml-4 text-sm font-sans font-normal text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                {packages.length}
              </span>
            </h2>

            {packages.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-gray-300">
                <div className="mb-6 text-6xl">🌍</div>
                <h3 className="text-2xl font-serif font-medium mb-4">No journeys yet</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                  Your passport is waiting to be stamped. Start planning your next premium styling adventure today.
                </p>
                <Link to="/" className="text-black font-semibold border-b-2 border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors">
                  Browse Destinations
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {packages.map((pkg) => (
                  <div key={pkg._id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col h-full">
                    { }
                    <div className="h-48 overflow-hidden relative">
                      {pkg.stayId?.images && pkg.stayId.images.length > 0 ? (
                        <img
                          src={pkg.stayId.images[0]}
                          alt={pkg.stayId.name}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(pkg.status)}`}>
                        {pkg.status}
                      </div>
                    </div>

                    { }
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="mb-4">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                          {pkg.stayId?.category || 'Custom Trip'}
                        </p>
                        <h3 className="text-2xl font-serif font-bold group-hover:text-gray-700 transition-colors line-clamp-2">
                          {pkg.stayId?.name || 'Your Custom Package'}
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-8 text-sm text-gray-600 border-t border-b border-gray-100 py-4">
                        <div>
                          <p className="text-gray-400 text-xs uppercase mb-1">Duration</p>
                          <p className="font-medium text-black">{pkg.numberOfDays} Days</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs uppercase mb-1">Travelers</p>
                          <p className="font-medium text-black">{pkg.numberOfPeople} People</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs uppercase mb-1">Date</p>
                          <p className="font-medium text-black">{new Date(pkg.checkInDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs uppercase mb-1">Total</p>
                          <p className="font-medium text-black">₹{pkg.pricing?.grandTotal?.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="mt-auto flex justify-between items-center bg-gray-50 -mx-8 -mb-8 px-8 py-4">
                        <Link
                          to={`/package/${pkg._id}`}
                          className="text-sm font-bold text-black hover:text-gray-600 transition-colors"
                        >
                          VIEW DETAILS
                        </Link>

                        <div className="flex gap-4">
                          {pkg.status === 'draft' && (
                            <Link
                              to={`/customize?package=${pkg._id}`}
                              className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
                            >
                              Edit
                            </Link>
                          )}
                          {(pkg.status === 'draft' || pkg.status === 'booked' || pkg.status === 'confirmed') && (
                            <button
                              onClick={() => handleCancelPackage(pkg._id)}
                              className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
                            >
                              {pkg.status === 'draft' ? 'Delete' : 'Cancel'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="mb-20 animate-fade-in-up">
            <UserChatPanel />
          </div>
        )}

        { }
        <div>
          <h2 className="text-2xl font-serif font-bold mb-8">Curated Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/category/basic" className="relative h-64 group rounded-2xl overflow-hidden cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Basic"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex flex-col justify-end p-8 text-white">
                <h3 className="text-xl font-bold mb-1">Basic Collection</h3>
                <p className="text-sm opacity-90">Under ₹1,500 / night</p>
              </div>
            </Link>

            <Link to="/category/premium" className="relative h-64 group rounded-2xl overflow-hidden cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Premium"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex flex-col justify-end p-8 text-white">
                <h3 className="text-xl font-bold mb-1">Premium Collection</h3>
                <p className="text-sm opacity-90">₹1,500 - ₹3,000 / night</p>
              </div>
            </Link>

            <Link to="/category/luxury" className="relative h-64 group rounded-2xl overflow-hidden cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Luxury"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex flex-col justify-end p-8 text-white">
                <h3 className="text-xl font-bold mb-1">Luxury Collection</h3>
                <p className="text-sm opacity-90">₹3,000+ / night</p>
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;