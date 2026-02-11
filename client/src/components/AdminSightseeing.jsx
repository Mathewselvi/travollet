import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../utils/api';

const AdminSightseeing = () => {
  const navigate = useNavigate();
  const [sightseeing, setSightseeing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [availItem, setAvailItem] = useState(null);
  const [blockDate, setBlockDate] = useState('');
  const [blockEndDate, setBlockEndDate] = useState('');
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchSightseeing();
  }, []);

  const fetchSightseeing = async () => {
    try {
      const response = await adminAPI.getAllSightseeing();
      setSightseeing(response.data);

      const bookingsResponse = await adminAPI.getAllPackages();
      setBookings(bookingsResponse.data);
    } catch (error) {
      console.error('Error fetching sightseeing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sightseeing activity?')) {
      try {
        await adminAPI.deleteSightseeing(id);
        fetchSightseeing();
      } catch {
        alert('Error deleting sightseeing');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      pricePerPerson: '',
      duration: '',
      description: '',
      location: '',
      images: '',
      highlights: '',
      included: '',
      isActive: true,
      maxSlotsPerDay: 50
    });
    setEditing(null);
    setEditing(null);
    setShowForm(false);
  };

  const handleManageAvailability = (item) => {
    setAvailItem(item);
    setBlockDate('');
    setBlockEndDate('');
    setShowAvailabilityModal(true);
  };

  const handleAddBlockDate = async () => {
    if (!blockDate) return;


    const start = new Date(blockDate);
    const end = blockEndDate ? new Date(blockEndDate) : start;

    if (end < start) {
      alert("End date cannot be before start date");
      return;
    }

    const setOfDates = new Set(availItem.unavailableDates || []);


    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      setOfDates.add(d.toISOString().split('T')[0]);
    }

    const newDates = Array.from(setOfDates).sort();

    try {
      await adminAPI.updateSightseeing(availItem._id, { unavailableDates: newDates });


      const updatedItem = { ...availItem, unavailableDates: newDates };
      setAvailItem(updatedItem);
      setSightseeing(sightseeing.map(s => s._id === updatedItem._id ? updatedItem : s));
      setBlockDate('');
      setBlockEndDate('');
    } catch {
      alert('Error updating availability');
    }
  };

  const handleEarlyCheckout = async (pkg) => {
    const today = new Date().toISOString().split('T')[0];
    const newDate = prompt("Enter new Checkout Date (Early Checkout):", today);
    if (!newDate) return;

    if (confirm(`Are you sure you want to shorten this activity usage to end on ${newDate}? This will free up availability for subsequent dates.`)) {
      try {
        await adminAPI.earlyCheckout(pkg._id, newDate);

        const bookingsResponse = await adminAPI.getAllPackages();
        setBookings(bookingsResponse.data);
        alert("Booking updated and availability released.");
      } catch (error) {
        alert('Error processing early checkout');
        console.error(error);
      }
    }
  };

  const handleRemoveBlockDate = async (dateToRemove) => {
    try {
      const currentDates = availItem.unavailableDates || [];
      const newDates = currentDates.filter(d => d !== dateToRemove);

      await adminAPI.updateSightseeing(availItem._id, { unavailableDates: newDates });


      const updatedItem = { ...availItem, unavailableDates: newDates };
      setAvailItem(updatedItem);
      setSightseeing(sightseeing.map(s => s._id === updatedItem._id ? updatedItem : s));
    } catch {
      alert('Error updating availability');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-black">Manage Sightseeing</h1>
          <p className="text-gray-500 text-sm">Create and manage activities & tours</p>
        </div>
        <button
          onClick={() => navigate('/admin/sightseeing/add')}
          className="px-6 py-2 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gold transition-colors duration-300 rounded"
        >
          Add New Activity
        </button>
      </div>



      {showAvailabilityModal && availItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">Manage Availability</h2>
              <button onClick={() => setShowAvailabilityModal(false)} className="text-gray-400 hover:text-black text-xl">&times;</button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-4">Block dates for <strong>{availItem.name}</strong></p>
              <div className="mb-6 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Start Date</label>
                    <input
                      type="date"
                      value={blockDate}
                      onChange={(e) => setBlockDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black transition-colors"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">End Date (Optional)</label>
                    <input
                      type="date"
                      value={blockEndDate}
                      onChange={(e) => setBlockEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black transition-colors"
                      min={blockDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddBlockDate}
                  className="w-full py-2 bg-black text-white rounded font-bold text-sm hover:bg-gray-800 transition-colors"
                >
                  Block Dates
                </button>
              </div>

              <h3 className="font-bold text-sm mb-3 mt-6">Active & Past Bookings</h3>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {bookings.filter(b => b.sightseeingIds?.some(s => s._id === availItem._id) && (b.status === 'booked' || b.status === 'confirmed' || b.status === 'completed')).length > 0 ? (
                  bookings.filter(b => b.sightseeingIds?.some(s => s._id === availItem._id) && (b.status === 'booked' || b.status === 'confirmed' || b.status === 'completed')).map((booking) => (
                    <div key={booking._id} className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm font-bold text-black">{booking.userId?.name || 'Unknown User'}</div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">{booking.userId?.email}</div>
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${booking.status === 'completed' ? 'bg-gray-100 text-gray-600 border-gray-200' : 'bg-green-50 text-green-700 border-green-100'
                          }`}>
                          {booking.status}
                        </span>
                      </div>
                      <button
                        onClick={() => handleEarlyCheckout(booking)}
                        className={`w-full text-center py-2 text-xs font-bold uppercase tracking-wide rounded transition-colors ${booking.status === 'completed'
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'
                          }`}
                      >
                        {booking.status === 'completed' ? 'Update Checkout Date' : 'Early Checkout / Release'}
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 italic">No bookings found for this activity.</p>
                )}
              </div>

              <h3 className="font-bold text-sm mb-3">Blocked Dates</h3>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {availItem.unavailableDates && availItem.unavailableDates.length > 0 ? (
                  availItem.unavailableDates.map((date, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                      <span className="text-sm">{new Date(date).toLocaleDateString()}</span>
                      <button
                        onClick={() => handleRemoveBlockDate(date)}
                        className="text-red-500 text-xs hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 italic">No dates blocked.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {sightseeing.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-100 shadow-sm">
            <div className="text-4xl mb-4">🎭</div>
            <h3 className="text-lg font-bold text-black mb-2">No Activities Added</h3>
            <p className="text-gray-500 mb-6">Start by adding new sightseeing options.</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-gold font-bold uppercase tracking-wider text-xs hover:text-black transition-colors"
            >
              Add Your First Activity
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Activity</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Duration</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Price/Person</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sightseeing.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <img
                            src={item.images[0] || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop'}
                            alt={item.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div>
                            <div className="font-bold text-black">{item.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{item.duration}</td>
                      <td className="px-6 py-4 font-medium whitespace-nowrap">₹{item.pricePerPerson}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{item.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${item.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                          }`}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleManageAvailability(item)}
                            className="p-2 text-gold hover:bg-yellow-50 rounded transition-colors"
                            title="Manage Availability"
                          >
                            📅
                          </button>
                          <button
                            onClick={() => navigate(`/admin/sightseeing/edit/${item._id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSightseeing;