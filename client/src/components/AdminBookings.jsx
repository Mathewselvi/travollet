import { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';

const AdminBookings = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await adminAPI.getAllBookings();
      setPackages(response.data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (packageId, newStatus) => {
    try {
      await adminAPI.updateBookingStatus(packageId, newStatus);
      fetchPackages();
    } catch (error) {
      alert('Error updating booking status');
      console.error('Error:', error);
    }
  };

  const handleEarlyCheckout = async (pkg) => {
    const today = new Date().toISOString().split('T')[0];
    const newDate = prompt("Enter new Checkout Date (Early Checkout):", today);
    if (!newDate) return;

    if (confirm(`Are you sure you want to shorten this stay to end on ${newDate}? This will free up availability for subsequent dates.`)) {
      try {
        await adminAPI.earlyCheckout(pkg._id, newDate);
        fetchPackages();
        alert("Booking updated and marked as Completed.");
      } catch (error) {
        alert('Error processing early checkout');
        console.error(error);
      }
    }
  };

  const handleDeleteBooking = async (packageId) => {
    if (confirm('Are you sure you want to DELETE this booking? This action cannot be undone.')) {
      try {
        await adminAPI.deleteBooking(packageId);
        fetchPackages();
        alert('Booking deleted successfully');
      } catch (error) {
        alert('Error deleting booking');
        console.error('Error:', error);
      }
    }
  };

  const handleRefund = async (packageId) => {
    if (confirm('Are you sure you want to process a refund for this booking?')) {
      try {
        await adminAPI.refundBooking(packageId);
        fetchPackages();
        alert('Refund processed successfully');
      } catch (error) {
        alert('Error processing refund');
        console.error('Error:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      booked: 'bg-green-100 text-green-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-purple-100 text-purple-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusOptions = (currentStatus) => {
    const statusFlow = {
      draft: ['booked', 'cancelled'],
      booked: ['confirmed', 'cancelled'],
      confirmed: ['completed', 'cancelled'],
      completed: [],
      cancelled: []
    };
    return statusFlow[currentStatus] || [];
  };

  const filteredPackages = packages.filter(pkg => {
    if (filter === 'all') return true;
    return pkg.status === filter;
  });

  if (loading) return <div>Loading...</div>;

  const StatCard = ({ title, value, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className={`text-4xl font-bold mb-2 ${color}`}>{value}</h3>
      <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-black">Booking Management</h1>
          <p className="text-gray-500 text-sm">View and manage customer bookings</p>
        </div>
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none bg-white border border-gray-200 text-black py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:border-black transition-colors cursor-pointer"
          >
            <option value="all">All Bookings</option>
            <option value="draft">Draft</option>
            <option value="booked">Booked</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
          </div>
        </div>
      </div>

      { }
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Booked" value={packages.filter(p => p.status === 'booked').length} color="text-green-600" />
        <StatCard title="Confirmed" value={packages.filter(p => p.status === 'confirmed').length} color="text-blue-600" />
        <StatCard title="Completed" value={packages.filter(p => p.status === 'completed').length} color="text-purple-600" />
      </div>

      { }
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredPackages.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No bookings found{filter !== 'all' ? ` with status: ${filter}` : ''}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Stay & Dates</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Details</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Total</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPackages.map((pkg) => (
                  <tr key={pkg._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-bold text-black">{pkg.userId?.name || 'Unknown'}</div>
                        <div className="text-xs text-gray-400">{pkg.userId?.email}</div>
                        <div className="text-xs text-gray-400">{pkg.userId?.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-black">{pkg.stayId?.name || 'Custom Stay'}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(pkg.checkInDate).toLocaleDateString()} - {new Date(pkg.checkOutDate).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      <div>{pkg.numberOfPeople} people</div>
                      <div>{pkg.numberOfDays} days</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-black whitespace-nowrap">
                      ₹{pkg.pricing?.grandTotal.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide ${getStatusColor(pkg.status)}`}>
                        {pkg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-2">
                        {getStatusOptions(pkg.status).map(status => (
                          <button
                            key={status}
                            onClick={() => handleStatusUpdate(pkg._id, status)}
                            className="px-3 py-1 bg-black text-white text-xs font-medium uppercase tracking-wider rounded hover:bg-gray-800 transition-colors"
                          >
                            Mark {status}
                          </button>
                        ))}
                        <button
                          onClick={() => setSelectedBooking(pkg)}
                          className="px-3 py-1 bg-blue-600 text-white text-xs font-medium uppercase tracking-wider rounded hover:bg-blue-700 transition-colors"
                        >
                          View Details
                        </button>
                        {(pkg.status === 'booked' || pkg.status === 'confirmed') && (
                          <button
                            onClick={() => handleEarlyCheckout(pkg)}
                            className="px-3 py-1 bg-red-600 text-white text-xs font-medium uppercase tracking-wider rounded hover:bg-red-700 transition-colors"
                          >
                            Early Checkout
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteBooking(pkg._id)}
                          className="px-3 py-1 bg-red-800 text-white text-xs font-medium uppercase tracking-wider rounded hover:bg-red-900 transition-colors"
                        >
                          Delete
                        </button>
                        {pkg.status === 'cancelled' && pkg.paymentStatus === 'paid' && (
                          <button
                            onClick={() => handleRefund(pkg._id)}
                            className="px-3 py-1 bg-yellow-600 text-white text-xs font-medium uppercase tracking-wider rounded hover:bg-yellow-700 transition-colors"
                          >
                            Refund
                          </button>
                        )}

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>


      { }
      { }
      {
        selectedBooking && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl relative my-8">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <div>
                    <h2 className="text-xl font-bold text-black">Booking Details</h2>
                    <p className="text-sm text-gray-500">ID: {selectedBooking._id}</p>
                  </div>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="text-gray-400 hover:text-black text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                  >
                    &times;
                  </button>
                </div>

                <div className="p-8 space-y-8">
                  { }
                  <section>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Customer Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <span className="block text-xs text-gray-500 uppercase">Name</span>
                        <span className="font-medium text-lg">{selectedBooking.userId?.name}</span>
                      </div>
                      <div>
                        <span className="block text-xs text-gray-500 uppercase">Email</span>
                        <span className="font-medium text-lg">{selectedBooking.userId?.email}</span>
                      </div>
                      <div>
                        <span className="block text-xs text-gray-500 uppercase">Phone</span>
                        <span className="font-medium text-lg">{selectedBooking.userId?.phone || 'N/A'}</span>
                      </div>
                    </div>
                  </section>

                  { }
                  <section>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Trip Itinerary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      { }
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-bold text-black mb-3 flex items-center max-w-full"><span className="text-xl mr-2">🏨</span> Stay Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between border-b border-gray-200 pb-1">
                            <span className="text-gray-600">Property</span>
                            <span className="font-medium">{selectedBooking.stayId?.name}</span>
                          </div>
                          <div className="flex justify-between border-b border-gray-200 pb-1">
                            <span className="text-gray-600">Dates</span>
                            <span className="font-medium">
                              {new Date(selectedBooking.checkInDate).toLocaleDateString()} - {new Date(selectedBooking.checkOutDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-gray-200 pb-1">
                            <span className="text-gray-600">Duration</span>
                            <span className="font-medium">{selectedBooking.numberOfDays} Nights</span>
                          </div>
                          <div className="flex justify-between border-b border-gray-200 pb-1">
                            <span className="text-gray-600">Guests</span>
                            <span className="font-medium">{selectedBooking.numberOfPeople} People</span>
                          </div>
                          <div className="flex justify-between pt-1">
                            <span className="text-gray-600">Stay Cost</span>
                            <span className="font-bold">₹{selectedBooking.pricing?.stayTotal?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      { }
                      <div className="space-y-4">
                        {selectedBooking.transportationId ? (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-black mb-3 flex items-center"><span className="text-xl mr-2">🚗</span> Transport</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between border-b border-gray-200 pb-1">
                                <span className="text-gray-600">Vehicle</span>
                                <span className="font-medium">{selectedBooking.transportationId.name}</span>
                              </div>
                              <div className="flex justify-between pt-1">
                                <span className="text-gray-600">Transport Cost</span>
                                <span className="font-bold">₹{selectedBooking.pricing?.transportationTotal?.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-50 p-4 rounded-lg text-gray-400 italic text-sm text-center">No Transportation Selected</div>
                        )}

                        {/* Airport Transfer Section */}
                        {selectedBooking.airportTransferDetails ? (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold flex items-center gap-2 mb-2">
                              <span>✈️</span> Airport Transfer
                            </h4>
                            <div className="space-y-2">
                              <div>
                                <p className="text-xs text-gray-500 uppercase">Selected Vehicles</p>
                                <ul className="text-sm list-disc list-inside">
                                  {selectedBooking.airportTransferDetails.vehicles?.map((v, i) => (
                                    <li key={i}>
                                      {v.count}x {v.vehicleType} (₹{(v.price * v.count).toLocaleString()})
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-gray-500 uppercase">Arrival</p>
                                  <p className="font-medium">{selectedBooking.airportTransferDetails.arrivalFlight || 'N/A'}</p>
                                  <p className="text-xs text-gray-400">
                                    {selectedBooking.airportTransferDetails.arrivalTime
                                      ? new Date(selectedBooking.airportTransferDetails.arrivalTime).toLocaleString()
                                      : '-'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 uppercase">Departure</p>
                                  <p className="font-medium">{selectedBooking.airportTransferDetails.departureFlight || 'N/A'}</p>
                                  <p className="text-xs text-gray-400">
                                    {selectedBooking.airportTransferDetails.departureTime
                                      ? new Date(selectedBooking.airportTransferDetails.departureTime).toLocaleString()
                                      : '-'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-50 p-4 rounded-lg text-gray-500 text-sm">
                            No airport transfer selected.
                          </div>
                        )}

                        {selectedBooking.sightseeingIds && selectedBooking.sightseeingIds.length > 0 ? (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-bold text-black mb-3 flex items-center"><span className="text-xl mr-2">🎭</span> Activities</h4>
                            <ul className="space-y-2 text-sm">
                              {selectedBooking.sightseeingIds.map((activity, idx) => (
                                <li key={idx} className="flex justify-between border-b border-gray-200 pb-1 last:border-0 last:pb-0">
                                  <span className="text-gray-600">{activity.name}</span>
                                  <span className="font-medium">₹{activity.pricePerPerson} / person</span>
                                </li>
                              ))}
                              <div className="flex justify-between pt-2 border-t border-gray-200">
                                <span className="text-gray-600">Activities Cost</span>
                                <span className="font-bold">₹{selectedBooking.pricing?.sightseeingTotal?.toLocaleString()}</span>
                              </div>
                            </ul>
                          </div>
                        ) : (
                          <div className="bg-gray-50 p-4 rounded-lg text-gray-400 italic text-sm text-center">No Activities Selected</div>
                        )}
                      </div>
                    </div>
                  </section>

                  { }
                  <section className="bg-black text-white p-6 rounded-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                      <div className="space-y-4">
                        <div>
                          <span className="block text-xs text-gray-400 uppercase mb-1">Booking Status</span>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider ${selectedBooking.status === 'confirmed' ? 'bg-blue-500' :
                            selectedBooking.status === 'booked' ? 'bg-green-500' :
                              selectedBooking.status === 'completed' ? 'bg-purple-500' : 'bg-gray-700'
                            }`}>
                            {selectedBooking.status}
                          </span>
                        </div>
                        <div>
                          <span className="block text-xs text-gray-400 uppercase mb-1">Payment Status</span>
                          <span className="text-lg font-medium capitalize">{selectedBooking.paymentStatus}</span>
                        </div>
                        {selectedBooking.specialRequests && (
                          <div>
                            <span className="block text-xs text-gray-400 uppercase mb-1">Special Requests</span>
                            <p className="text-sm italic text-gray-300">"{selectedBooking.specialRequests}"</p>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="block text-sm text-gray-400 uppercase mb-1">Grand Total</span>
                        <span className="text-5xl font-bold text-gold">₹{selectedBooking.pricing?.grandTotal?.toLocaleString()}</span>
                      </div>
                    </div>
                  </section>
                </div>
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="px-6 py-2 bg-white border border-gray-300 rounded font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Close Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default AdminBookings;