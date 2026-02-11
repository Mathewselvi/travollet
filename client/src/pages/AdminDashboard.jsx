import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { adminAPI } from '../utils/api';
import AdminStays from '../components/AdminStays';
import AdminStayForm from './admin/AdminStayForm';
import AdminTransportation from '../components/AdminTransportation';
import AdminTransportationForm from './admin/AdminTransportationForm';
import AdminSightseeing from '../components/AdminSightseeing';
import AdminSightseeingForm from './admin/AdminSightseeingForm';
import AdminDestinations from '../components/AdminDestinations';
import AdminBookings from '../components/AdminBookings';
import AdminTourPackages from '../components/AdminTourPackages';
import AdminGallery from '../components/AdminGallery';
import AdminSiteContent from '../components/AdminSiteContent';
import AdminChatPanel from '../components/AdminChatPanel';
import AdminAirportTransfer from './admin/AdminAirportTransfer';

import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetchDashboardData();
  }, []);


  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const fetchDashboardData = async () => {
    try {
      const response = await adminAPI.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl font-medium text-gray-400 tracking-widest animate-pulse">
          LOADING ADMIN DASHBOARD...
        </div>
      </div>
    );
  }

  const NavItem = ({ to, label, icon }) => {
    const isActive = location.pathname === to || (to !== '/admin' && location.pathname.startsWith(to));
    return (
      <Link
        to={to}
        className={`flex items-center gap-4 px-6 py-4 transition-all duration-300 border-l-4 ${isActive
          ? 'border-gold bg-white/5 text-white'
          : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
          }`}
      >
        <span className="text-xl">{icon}</span>
        <span className="text-sm font-medium uppercase tracking-wider">{label}</span>
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      { }
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      { }
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-black flex flex-col shadow-2xl transition-transform duration-300 ease-in-out overflow-hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
      >
        <div className="p-6 flex items-center justify-between">
          <img src={logo} alt="Travollet Admin" className="h-28 w-auto brightness-0 invert" />
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="px-6 mb-8">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Management</h2>
          <div className="h-px bg-gray-800 w-full"></div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto min-h-0 overscroll-none">
          <NavItem to="/admin" label="Overview" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>} />
          <NavItem to="/admin/content" label="Site Content" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>} />
          <NavItem to="/admin/messages" label="Messages" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>} />
          <NavItem to="/admin/stays" label="Stays" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} />
          <NavItem to="/admin/transportation" label="Transport" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>} />
          <NavItem to="/admin/sightseeing" label="Sightseeing" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>} />
          <NavItem to="/admin/destinations" label="Destinations" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
          <NavItem to="/admin/airport-transfers" label="Airport Transfer" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>} />
          <NavItem to="/admin/tour-packages" label="Packages" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>} />
          <NavItem to="/admin/bookings" label="Bookings" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>} />
          <NavItem to="/admin/gallery" label="Gallery" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} />
        </nav>



        <div className="p-6 mt-auto space-y-4">
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to logout?")) {
                logout();
                window.location.href = '/login';
              }
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 hover:bg-red-900 border border-gray-800 text-gray-400 hover:text-white rounded-xl transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            <span className="text-sm font-bold uppercase tracking-wider">Sign Out</span>
          </button>

          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <p className="text-xs text-gray-500 uppercase mb-1">Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-white text-xs font-medium">System Online</span>
            </div>
          </div>
        </div>
      </aside>

      { }
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        { }
        <header className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-600 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-bold text-lg">Dashboard</span>
          <div className="w-6"></div> { }
        </header>

        { }
        <main className="flex-1 bg-gray-50 p-4 md:p-8">
          <Routes>
            <Route path="/" element={<AdminOverview data={dashboardData} />} />
            <Route path="/stays" element={<AdminStays />} />
            <Route path="/stays/add" element={<AdminStayForm />} />
            <Route path="/stays/edit/:id" element={<AdminStayForm />} />
            <Route path="/transportation" element={<AdminTransportation />} />
            <Route path="/transportation/add" element={<AdminTransportationForm />} />
            <Route path="/transportation/edit/:id" element={<AdminTransportationForm />} />
            <Route path="/sightseeing" element={<AdminSightseeing />} />
            <Route path="/sightseeing/add" element={<AdminSightseeingForm />} />
            <Route path="/sightseeing/edit/:id" element={<AdminSightseeingForm />} />
            <Route path="/destinations" element={<AdminDestinations />} />
            <Route path="/airport-transfers" element={<AdminAirportTransfer />} />
            <Route path="/tour-packages" element={<AdminTourPackages />} />
            <Route path="/bookings" element={<AdminBookings />} />
            <Route path="/gallery" element={<AdminGallery />} />
            <Route path="/content" element={<AdminSiteContent />} />
            <Route path="/messages" element={<AdminChatPanel />} />
          </Routes>
        </main>
      </div>
    </div >
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between group hover:shadow-lg transition-shadow duration-300">
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{title}</p>
      <h3 className="text-3xl font-bold text-black">{value}</h3>
    </div>
    <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-xl`}>
      {icon}
    </div>
  </div>
);

const AdminOverview = ({ data }) => {
  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Dashboard Overview</h1>
          <p className="text-gray-500">Welcome back, Administrator</p>
        </div>
        <div className="text-left md:text-right">
          <p className="text-sm font-medium text-black bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm inline-block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      { }
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="Total Stays" value={data.totalStays} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} color="text-blue-600 bg-blue-600" />
        <StatCard title="Transportation" value={data.totalTransportation} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>} color="text-green-600 bg-green-600" />
        <StatCard title="Sightseeing" value={data.totalSightseeing} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>} color="text-purple-600 bg-purple-600" />
        <StatCard title="Tour Packages" value={data.totalTourPackages || 0} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>} color="text-gold bg-gold" />
        <StatCard title="Total Bookings" value={data.totalBookings || 0} icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>} color="text-indigo-600 bg-indigo-600" />
      </div>

      { }
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 md:px-8 md:py-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-lg font-bold text-black">Recent Booking Activity</h3>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">{data.bookedPackages} Active Bookings</span>
        </div>

        {data.recentPackages && data.recentPackages.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Stay / Destination</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.recentPackages.slice(0, 10).map((pkg) => (
                  <tr key={pkg._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-black">{pkg.userId?.name || 'Unknown User'}</div>
                      <div className="text-xs text-gray-400">{pkg.userId?.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {pkg.stayId?.name || 'Custom Package'}
                    </td>
                    <td className="px-6 py-4 font-medium text-black whitespace-nowrap">
                      ₹{pkg.pricing?.grandTotal?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${pkg.status === 'booked' ? 'bg-green-100 text-green-800' :
                        pkg.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          pkg.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                            'bg-yellow-100 text-yellow-800'
                        }`}>
                        {pkg.status ? pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1) : 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(pkg.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            No booking activity recorded yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;