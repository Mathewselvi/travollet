import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { userAPI, packageAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useTrip } from '../context/TripContext';


import SkeletonLoader from '../components/common/SkeletonLoader';

const CustomizePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const existingPackageId = searchParams.get('package');



  const [loading, setLoading] = useState(!!existingPackageId);
  const [data, setData] = useState({
    basic: [],
    premium: [],
    luxury: [],
    transportation: [],
    sightseeing: [],
    transferVehicles: []
  });

  const [formData, setFormData] = useState({
    category: 'basic',
    stayId: '',
    transportationId: '',
    sightseeingIds: [],
    numberOfPeople: 1,
    numberOfDays: 1,
    checkInDate: '',
    checkOutDate: '',
    specialRequests: ''
  });

  const [airportPickup, setAirportPickup] = useState(false);
  const [flightDetails, setFlightDetails] = useState({
    vehicles: [], // Array of { vehicleType, count, price, image }
    arrivalFlight: '',
    arrivalTime: '',
    departureFlight: '',
    departureTime: ''
  });

  const [pricing, setPricing] = useState(null);

  const [step, setStep] = useState(0);

  const { trip } = useTrip();


  useEffect(() => {
    if (existingPackageId) {

      const initEdit = async () => {
        try {
          const response = await packageAPI.getPackageDetails(existingPackageId);
          const pkg = response.data;
          setFormData({
            category: pkg.stayId.category,
            stayId: pkg.stayId._id,
            transportationId: pkg.transportationId._id,
            sightseeingIds: pkg.sightseeingIds.map(s => s._id),
            numberOfPeople: pkg.numberOfPeople,
            numberOfDays: pkg.numberOfDays,
            checkInDate: pkg.checkInDate.split('T')[0],
            checkOutDate: pkg.checkOutDate.split('T')[0],
            specialRequests: pkg.specialRequests || ''
          });
          setStep(1);
        } catch (e) {
          console.error("Failed to load existing package", e);
          setLoading(false);
        }
      };
      initEdit();
    } else if (trip.stay || trip.transportation || trip.sightseeing.length > 0) {

      setFormData(prev => ({
        ...prev,
        category: trip.stay ? trip.stay.category : 'basic',
        stayId: trip.stay ? trip.stay._id : '',
        transportationId: trip.transportation ? trip.transportation._id : '',
        sightseeingIds: trip.sightseeing.map(s => s._id),
      }));


    }
  }, [existingPackageId, trip]);


  useEffect(() => {
    if (step === 1) {

      if (formData.checkInDate && formData.checkOutDate) {
        fetchData();
      }
    }
  }, [step, formData.checkInDate, formData.checkOutDate]);

  useEffect(() => {

  }, []);

  useEffect(() => {
    if (formData.stayId && formData.transportationId) {
      calculatePricing();
    }
  }, [formData.stayId, formData.transportationId, formData.sightseeingIds, formData.numberOfPeople, formData.numberOfDays, airportPickup, flightDetails.vehicles]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [basicRes, premiumRes, luxuryRes, transportRes, sightseeingRes, transferRes] = await Promise.all([
        userAPI.getStaysByCategory('basic', { params: { checkIn: formData.checkInDate, checkOut: formData.checkOutDate, guests: formData.numberOfPeople } }),
        userAPI.getStaysByCategory('premium', { params: { checkIn: formData.checkInDate, checkOut: formData.checkOutDate, guests: formData.numberOfPeople } }),
        userAPI.getStaysByCategory('luxury', { params: { checkIn: formData.checkInDate, checkOut: formData.checkOutDate, guests: formData.numberOfPeople } }),
        userAPI.getTransportation({ params: { checkIn: formData.checkInDate, checkOut: formData.checkOutDate } }),
        userAPI.getSightseeing({ params: { checkIn: formData.checkInDate, checkOut: formData.checkOutDate } }),
        userAPI.getAirportTransfers()
      ]);

      setData({
        basic: basicRes.data,
        premium: premiumRes.data,
        luxury: luxuryRes.data,
        transportation: transportRes.data,
        sightseeing: sightseeingRes.data,
        transferVehicles: transferRes.data
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };



  const calculatePricing = async () => {
    if (!formData.stayId || !formData.transportationId || formData.numberOfPeople < 1 || formData.numberOfDays < 1) {
      setPricing(null);
      return;
    }

    // Since I removed the API call in previous steps (assuming calculation is now client-side or handled differently as per previous "remove unused usage"),
    // but the original code was making an API call.
    // Wait, the previous edit removed the API call logic but left the `catch` block.
    // I need to either restore the API call logic properly OR fully remove the calculatePricing body if it's not needed.
    // Given the context is "Remove dead code", and I removed `setCalculating`, maybe I broke it.
    // Let's restore the API call but without `setCalculating`.

    try {
      const response = await userAPI.calculatePrice({
        stayId: formData.stayId,
        transportationId: formData.transportationId,
        sightseeingIds: formData.sightseeingIds,
        numberOfPeople: formData.numberOfPeople,
        numberOfDays: formData.numberOfDays,
        airportPickup,
        airportTransferDetails: airportPickup ? {
          ...flightDetails,
          price: flightDetails.vehicles.reduce((sum, v) => sum + (v.price * v.count), 0)
        } : undefined
      });
      setPricing(response.data);
    } catch (error) {
      console.error('Error calculating price:', error);
      setPricing(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    if (name !== 'sightseeingIds') {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseInt(value) || 0 : value
      }));
    }
  };

  const toggleSightseeing = (id) => {
    setFormData(prev => {
      const current = prev.sightseeingIds;
      if (current.includes(id)) {
        return { ...prev, sightseeingIds: current.filter(item => item !== id) };
      } else {
        return { ...prev, sightseeingIds: [...current, id] };
      }
    });
  };

  const handleFlightChange = (e) => {
    const { name, value } = e.target;
    setFlightDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {

      if (window.confirm("You need to login to continue. Go to login page?")) {
        navigate('/login');
      }
      return;
    }

    if (!formData.checkInDate || !formData.checkOutDate) {
      alert('Please select check-in and check-out dates');
      return;
    }

    if (airportPickup) {
      if (flightDetails.vehicles.length === 0) {
        alert('Please select a vehicle for airport transfer.');
        return;
      }
      if (!flightDetails.arrivalTime || !flightDetails.departureTime) {
        alert('Please provide arrival and departure times for airport pickup/drop.');
        return;
      }
    }

    try {
      const packageData = {
        ...formData,
        checkInDate: new Date(formData.checkInDate),
        checkOutDate: new Date(formData.checkOutDate),
        airportPickup,
        airportTransferDetails: airportPickup ? {
          ...flightDetails,
          price: flightDetails.vehicles.reduce((sum, v) => sum + (v.price * v.count), 0)
        } : undefined
      };

      if (existingPackageId) {
        await packageAPI.updatePackage(existingPackageId, packageData);
        navigate(`/payment/${existingPackageId}`);
      } else {
        const response = await packageAPI.createPackage(packageData);
        navigate(`/payment/${response.data.package._id}`);
      }
    } catch (error) {
      alert('Error saving package. Please try again.');
      console.error('Error:', error);
    }
  };


  const currentStays = data[formData.category] || [];


  const selectCategory = (cat) => setFormData(prev => ({ ...prev, category: cat, stayId: '' }));
  const selectStay = (id) => setFormData(prev => ({ ...prev, stayId: id }));
  const selectTransport = (id) => setFormData(prev => ({ ...prev, transportationId: id }));


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        { }
        <div className="relative pt-32 pb-24 px-6 bg-black flex flex-col items-center">
          <SkeletonLoader height="h-4" width="w-48" className="mb-4 bg-gray-800" />
          <SkeletonLoader height="h-12" width="w-3/4 md:w-1/2" className="mb-4 bg-gray-800" />
          <SkeletonLoader height="h-6" width="w-full md:w-2/3" className="bg-gray-800" />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-16 relative z-20">
          { }
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mb-12">
            <div className="flex justify-center mb-8">
              <SkeletonLoader height="h-8" width="w-64" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <SkeletonLoader key={i} height="h-40" className="rounded-xl" />
              ))}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            { }
            <div className="flex-1 space-y-12 pb-12">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex items-center gap-4 mb-6">
                    <SkeletonLoader height="h-8" width="w-8" className="rounded-full" />
                    <SkeletonLoader height="h-6" width="w-48" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SkeletonLoader height="h-48" className="rounded-xl" />
                    <SkeletonLoader height="h-48" className="rounded-xl" />
                  </div>
                </div>
              ))}
            </div>

            { }
            <div className="lg:w-1/3">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden h-96 p-6">
                <SkeletonLoader height="h-8" width="w-full" className="mb-6" />
                <div className="space-y-4">
                  <SkeletonLoader height="h-12" width="w-full" />
                  <SkeletonLoader height="h-12" width="w-full" />
                  <SkeletonLoader height="h-12" width="w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const airportTransferPrice = airportPickup
    ? flightDetails.vehicles.reduce((sum, v) => sum + (v.price * v.count), 0)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      { }
      <div className="relative text-white pt-32 pb-24 px-6 overflow-hidden">
        { }
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1637066742971-726bee8d9f56?q=80&w=3649&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <span className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-4 block animate-fade-in-up">Craft Your Journey</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">Customize Your Escape</h1>
          <p className="text-gray-200 max-w-2xl mx-auto font-light leading-relaxed">
            Design a travel experience essentially tailored to your preferences. Select your stay, transport, and adventures.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-16 relative z-20">

        { }
        {step === 0 && (
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mb-12 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center font-serif text-black mb-8">Start Your Journey</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Check-in Date</label>
                <input
                  type="date"
                  name="checkInDate"
                  value={formData.checkInDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-white border border-gray-300 text-black rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Check-out Date</label>
                <input
                  type="date"
                  name="checkOutDate"
                  value={formData.checkOutDate}
                  onChange={handleInputChange}
                  min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-white border border-gray-300 text-black rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Number of Travelers</label>
                <input
                  type="number"
                  name="numberOfPeople"
                  value={formData.numberOfPeople}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-3 bg-white border border-gray-300 text-black rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  required
                />
              </div>
            </div>
            <button
              onClick={() => {
                if (formData.checkInDate && formData.checkOutDate && formData.numberOfPeople > 0) {

                  const start = new Date(formData.checkInDate);
                  const end = new Date(formData.checkOutDate);
                  const diffTime = Math.abs(end - start);
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  setFormData(prev => ({ ...prev, numberOfDays: diffDays }));
                  setStep(1);
                } else {
                  alert("Please fill in all details to proceed.");
                }
              }}
              className="w-full btn-unified bg-black text-white py-4 font-bold uppercase tracking-widest text-sm hover:bg-gray-800"
            >
              Find Available Options
            </button>
          </div>
        )}

        { }
        {step >= 1 && (
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mb-12">
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="bg-black text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Step 1</span>
              <h2 className="text-2xl font-bold text-center font-serif text-black">Choose Your Travel Style</h2>
              <button onClick={() => setStep(0)} className="text-xs text-gray-500 underline ml-4 hover:text-black">Change Dates</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: 'basic', label: 'Basic', price: '< ₹1,500', desc: 'Essential comfort for explorers.' },
                { id: 'premium', label: 'Premium', price: '₹1,500 - 3k', desc: 'Enhanced amenities & style.' },
                { id: 'luxury', label: 'Luxury', price: '₹3,000+', desc: 'Unparalleled opulence.' }
              ].map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => selectCategory(cat.id)}
                  className={`cursor-pointer border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-lg text-center ${formData.category === cat.id
                    ? 'border-gold bg-black text-white transform -translate-y-1'
                    : 'border-gray-100 bg-gray-50 text-black hover:border-gray-300'
                    }`}
                >
                  <h3 className="font-bold text-xl mb-2">{cat.label}</h3>
                  <p className={`text-sm font-bold uppercase tracking-wider mb-3 ${formData.category === cat.id ? 'text-gold' : 'text-gray-500'}`}>{cat.price}</p>
                  <p className={`text-sm ${formData.category === cat.id ? 'text-gray-300' : 'text-gray-500'}`}>{cat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {step >= 1 && (
          <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">

            { }
            <div className="flex-1 space-y-12 pb-12">

              { }
              <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">2</div>
                  <h2 className="text-xl font-bold text-black">Select Accommodation</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentStays.map(stay => (
                    <div
                      key={stay._id}
                      onClick={() => selectStay(stay._id)}
                      className={`group relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300 ${formData.stayId === stay._id ? 'border-gold ring-2 ring-gold/20' : 'border-transparent hover:shadow-xl'
                        }`}
                    >
                      <div className="aspect-video bg-gray-200 relative">
                        <img
                          src={stay.images[0] || 'https://via.placeholder.com/400x300'}
                          alt={stay.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <h3 className="font-bold text-lg leading-tight mb-1">{stay.name}</h3>
                          <p className="text-sm opacity-90 flex items-center gap-1">
                            <svg className="w-3 h-3 text-gold" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                            {stay.location}
                          </p>
                        </div>
                        {formData.stayId === stay._id && (
                          <div className="absolute top-3 right-3 bg-gold text-black text-xs font-bold px-2 py-1 rounded shadow-sm">
                            SELECTED
                          </div>
                        )}
                      </div>
                      <div className="p-4 bg-white border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Price / Night</p>
                            <p className="font-bold text-lg text-black">₹{stay.pricePerNight.toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <div className={`w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center ${formData.stayId === stay._id ? 'bg-black border-black' : ''}`}>
                              {formData.stayId === stay._id && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              { }
              <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">3</div>
                  <h2 className="text-xl font-bold text-black">Choose Transportation</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {data.transportation.map(transport => (
                    <div
                      key={transport._id}
                      onClick={() => selectTransport(transport._id)}
                      className={`cursor-pointer rounded-xl p-4 border transition-all duration-300 ${formData.transportationId === transport._id
                        ? 'bg-black text-white border-black ring-2 ring-gold/30'
                        : 'bg-white text-black border-gray-200 hover:border-black'
                        }`}
                    >
                      <div className="aspect-video rounded-lg bg-gray-100 overflow-hidden mb-4">
                        <img
                          src={transport.images[0] || 'https://via.placeholder.com/300x200'}
                          alt={transport.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-bold text-base mb-1">{transport.name}</h3>
                      <p className={`text-xs uppercase tracking-wide mb-2 ${formData.transportationId === transport._id ? 'text-gray-400' : 'text-gray-500'}`}>
                        {transport.type.replace('_', ' ')}
                      </p>
                      <div className="flex justify-between items-end">
                        <span className="font-bold">₹{transport.pricePerDay.toLocaleString()}<span className="text-xs font-normal opacity-70">/day</span></span>
                        {formData.transportationId === transport._id && (
                          <span className="w-2 h-2 rounded-full bg-gold"></span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              { }
              <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">4</div>
                  <h2 className="text-xl font-bold text-black">Trip Summary</h2>
                  <button type="button" onClick={() => setStep(0)} className="text-xs text-blue-600 hover:text-blue-800 underline ml-auto">Edit Dates</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Check-in Date</label>
                    <input
                      type="date"
                      name="checkInDate"
                      value={formData.checkInDate}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-300 text-gray-500 rounded-lg focus:outline-none cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Check-out Date</label>
                    <input
                      type="date"
                      name="checkOutDate"
                      value={formData.checkOutDate}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-300 text-gray-500 rounded-lg focus:outline-none cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Number of Travelers</label>
                    <input
                      type="number"
                      name="numberOfPeople"
                      value={formData.numberOfPeople}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-300 text-gray-500 rounded-lg focus:outline-none cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Duration (Days)</label>
                    <input
                      type="number"
                      name="numberOfDays"
                      value={formData.numberOfDays}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-300 text-gray-500 rounded-lg focus:outline-none cursor-not-allowed"
                    />
                  </div>
                </div>
              </section>

              { }
              <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">5</div>
                  <h2 className="text-xl font-bold text-black">Add Experiences (Optional)</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.sightseeing.map(sight => (
                    <div
                      key={sight._id}
                      onClick={() => toggleSightseeing(sight._id)}
                      className={`flex gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-300 ${formData.sightseeingIds.includes(sight._id)
                        ? 'bg-black border-black text-white'
                        : 'bg-white border-gray-200 text-black hover:border-black'
                        }`}
                    >
                      <img
                        src={sight.images[0] || 'https://via.placeholder.com/100'}
                        alt={sight.name}
                        className="w-20 h-20 rounded-lg object-cover bg-gray-100"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-sm mb-1 line-clamp-1">{sight.name}</h3>
                          {formData.sightseeingIds.includes(sight._id) && <span className="text-gold text-lg">✓</span>}
                        </div>
                        <p className={`text-xs mb-2 ${formData.sightseeingIds.includes(sight._id) ? 'text-gray-400' : 'text-gray-500'}`}>{sight.duration}</p>
                        <p className="font-bold text-sm">₹{sight.pricePerPerson} <span className="text-xs font-normal opacity-70">/person</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              { }
              <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">6</div>
                    <h2 className="text-xl font-bold text-black">Airport Pickup & Drop</h2>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={airportPickup}
                      onChange={(e) => setAirportPickup(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    <span className="ml-3 text-sm font-medium text-gray-900">{airportPickup ? 'Yes' : 'No'}</span>
                  </label>
                </div>

                {airportPickup && (
                  <div className="space-y-6 animate-fadeIn">

                    {/* Vehicle Selection */}
                    <div>
                      <h3 className="font-bold text-sm uppercase tracking-wide text-gray-500 mb-3">Select Vehicle</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data.transferVehicles?.map(vehicle => {
                          const selected = flightDetails.vehicles.find(v => v.vehicleType === vehicle.vehicleType);
                          const count = selected?.count || 0;

                          return (
                            <div
                              key={vehicle._id}
                              className={`border rounded-lg p-3 transition-all ${count > 0
                                ? 'bg-black text-white border-black ring-2 ring-gold/30'
                                : 'bg-white border-gray-200'
                                }`}
                            >
                              <div className="aspect-video bg-gray-100 rounded mb-2 overflow-hidden">
                                <img
                                  src={vehicle.images?.[0] || 'https://via.placeholder.com/150x100?text=Vehicle'}
                                  alt={vehicle.vehicleType}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="font-bold text-sm mb-1">{vehicle.vehicleType}</div>
                              <div className="text-xs opacity-80 mb-2">Max {vehicle.maxPassengers} pax</div>
                              <div className="flex justify-between items-center">
                                <span className="font-bold">₹{vehicle.price.toLocaleString()}</span>
                                <div className="flex items-center gap-2 bg-white rounded text-black px-1">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setFlightDetails(prev => {
                                        const existing = prev.vehicles.find(v => v.vehicleType === vehicle.vehicleType);
                                        let newVehicles;
                                        if (existing) {
                                          if (existing.count > 1) {
                                            newVehicles = prev.vehicles.map(v => v.vehicleType === vehicle.vehicleType ? { ...v, count: v.count - 1 } : v);
                                          } else {
                                            newVehicles = prev.vehicles.filter(v => v.vehicleType !== vehicle.vehicleType);
                                          }
                                        } else {
                                          newVehicles = prev.vehicles;
                                        }
                                        return { ...prev, vehicles: newVehicles };
                                      });
                                    }}
                                    className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded disabled:opacity-50"
                                    disabled={count === 0}
                                  >
                                    -
                                  </button>
                                  <span className="text-sm font-bold w-4 text-center">{count}</span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setFlightDetails(prev => {
                                        const existing = prev.vehicles.find(v => v.vehicleType === vehicle.vehicleType);
                                        let newVehicles;
                                        if (existing) {
                                          newVehicles = prev.vehicles.map(v => v.vehicleType === vehicle.vehicleType ? { ...v, count: v.count + 1 } : v);
                                        } else {
                                          newVehicles = [...prev.vehicles, {
                                            vehicleType: vehicle.vehicleType,
                                            price: vehicle.price,
                                            image: vehicle.images?.[0],
                                            count: 1
                                          }];
                                        }
                                        return { ...prev, vehicles: newVehicles };
                                      });
                                    }}
                                    className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {!flightDetails.vehicles.length && <p className="text-red-500 text-xs mt-2">Please select at least one vehicle.</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-bold text-sm uppercase tracking-wide text-gray-500">Arrival Details</h3>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Flight Number</label>
                          <input
                            type="text"
                            name="arrivalFlight"
                            value={flightDetails.arrivalFlight}
                            onChange={handleFlightChange}
                            placeholder="e.g. AI-202"
                            className="w-full px-4 py-3 bg-white border border-gray-300 text-black rounded-lg focus:outline-none focus:border-black"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Arrival Time</label>
                          <input
                            type="datetime-local"
                            name="arrivalTime"
                            value={flightDetails.arrivalTime}
                            onChange={handleFlightChange}
                            className="w-full px-4 py-3 bg-white border border-gray-300 text-black rounded-lg focus:outline-none focus:border-black"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-bold text-sm uppercase tracking-wide text-gray-500">Departure Details</h3>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Flight Number</label>
                          <input
                            type="text"
                            name="departureFlight"
                            value={flightDetails.departureFlight}
                            onChange={handleFlightChange}
                            placeholder="e.g. AI-203"
                            className="w-full px-4 py-3 bg-white border border-gray-300 text-black rounded-lg focus:outline-none focus:border-black"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Departure Time</label>
                          <input
                            type="datetime-local"
                            name="departureTime"
                            value={flightDetails.departureTime}
                            onChange={handleFlightChange}
                            className="w-full px-4 py-3 bg-white border border-gray-300 text-black rounded-lg focus:outline-none focus:border-black"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              { }
              <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Special Requests</label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Any special requirements, dietary restrictions, or preferences..."
                  className="w-full px-4 py-3 bg-white border border-gray-300 text-black rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  style={{ color: 'black' }}
                />
              </section>

            </div>

            { }
            <div className="lg:w-1/3 text-black">
              <div className="sticky top-8 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-black text-white p-6">
                  <span className="text-gold text-xs font-bold uppercase tracking-widest block mb-1">Itinerary Preview</span>
                  <h2 className="text-2xl font-serif">Your Journey</h2>
                </div>

                <div className="p-6 space-y-6">
                  { }
                  <div className="space-y-4">
                    { }
                    <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Accommodation</p>
                        {formData.stayId ? (
                          <p className="font-bold text-sm text-black">
                            {currentStays.find(s => s._id === formData.stayId)?.name}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-400 italic">Not selected</p>
                        )}
                      </div>
                    </div>

                    { }
                    <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Transportation</p>
                        {formData.transportationId ? (
                          <p className="font-bold text-sm text-black">
                            {data.transportation.find(t => t._id === formData.transportationId)?.name}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-400 italic">Not selected</p>
                        )}
                      </div>
                    </div>

                    { }
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Experiences</p>
                        <p className="font-bold text-sm text-black">
                          {formData.sightseeingIds.length} Selected
                        </p>
                      </div>
                    </div>
                  </div>

                  { }
                  <div className="bg-gray-50 rounded-xl p-4">
                    {pricing ? (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Stay Total</span>
                          <span>₹{Math.round(pricing.pricing.stayTotal).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Transport Total</span>
                          <span>₹{Math.round(pricing.pricing.transportationTotal).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Sightseeing</span>
                          <span>₹{Math.round(pricing.pricing.sightseeingTotal).toLocaleString()}</span>
                        </div>
                        {airportPickup && airportTransferPrice > 0 && (
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Airport Transfer</span>
                            <span>₹{airportTransferPrice.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="pt-3 mt-3 border-t border-gray-200 flex justify-between items-end">
                          <span className="text-sm font-bold uppercase text-gray-700">Estimated Total</span>
                          <span className="text-2xl font-bold text-black">₹{(pricing.pricing.grandTotal + airportTransferPrice).toLocaleString()}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-400 text-sm">
                        Complete your selection to see pricing
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-unified bg-black text-white hover:bg-gold hover:text-black border-black hover:border-gold py-4 text-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : (existingPackageId ? 'Update & Pay' : 'Proceed to Payment')}
                  </button>
                </div>
              </div>
            </div>

          </form>
        )
        }
      </div >
    </div >
  );
};

export default CustomizePage;