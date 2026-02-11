import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { packageAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const PaymentPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated, loading: authLoading } = useAuth();

    const [loading, setLoading] = useState(true);
    const [packageData, setPackageData] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');


    useEffect(() => {
        if (authLoading) return;

        if (!isAuthenticated) {
            navigate('/login', { state: { from: location } });
            return;
        }

        const fetchPackage = async () => {
            try {
                const response = await packageAPI.getPackageDetails(id);
                const pkg = response.data;

                if (pkg.paymentStatus === 'paid') {
                    navigate(`/booking-success/${id}`);
                    return;
                }

                setPackageData(pkg);
            } catch (err) {
                setError('Failed to load package details. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPackage();
    }, [id, navigate, authLoading, isAuthenticated, location]);

    const handlePayment = async (e) => {
        if (e) e.preventDefault();
        setProcessing(true);
        setError('');

        try {
            // 1. Create order on backend
            const orderResponse = await packageAPI.createRazorpayOrder(id);
            const order = orderResponse.data;

            // 2. Open Official Razorpay Checkout
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_dummy_id',
                amount: order.amount,
                currency: order.currency,
                name: "Travollet",
                description: `Booking for ${packageData.stayId.name}`,
                order_id: order.is_mock ? null : order.id, // Only provide order_id if it's a real Razorpay order
                handler: async function (response) {
                    try {
                        setProcessing(true);
                        // 3. Verify payment on backend
                        const verifyRes = await packageAPI.verifyRazorpayPayment(id, {
                            razorpay_order_id: response.razorpay_order_id || order.id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (verifyRes.data.success) {
                            navigate(`/booking-success/${id}`);
                        } else {
                            setError('Payment verification failed.');
                            setProcessing(false);
                        }
                    } catch (err) {
                        console.error('Verification Error:', err);
                        setError('Error verifying payment.');
                        setProcessing(false);
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                    contact: user?.phone
                },
                theme: {
                    color: "#000000"
                },
                modal: {
                    ondismiss: function () {
                        setProcessing(false);
                    }
                }
            };

            if (order.is_mock) {
                // Inform user about using Test Mode keys
                console.warn("Using Mock Order. To see the REAL Razorpay modal, please add your rzp_test_ key to .env");
            }

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                setError(response.error.description);
                setProcessing(false);
            });
            rzp.open();

        } catch (err) {
            console.error(err);
            setError('Failed to initiate payment. Please ensure you have added your Razorpay Test Keys to the .env file.');
            setProcessing(false);
        }
    };

    if (loading || authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
            </div>
        );
    }

    if (!packageData) return <div className="text-center p-20">Package not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-20 px-4 md:px-6">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                { }
                <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-10 border border-gray-100 h-fit">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-2xl font-serif font-bold text-black">Secure Checkout</h1>
                        <div className="flex gap-2">
                            <div className="w-8 h-5 bg-gray-200 rounded"></div>
                            <div className="w-8 h-5 bg-gray-200 rounded"></div>
                            <div className="w-8 h-5 bg-gray-200 rounded"></div>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div className="bg-black/5 p-6 rounded-2xl mb-8 flex items-center gap-4 border border-black/5">
                        <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl">₹</div>
                        <div>
                            <p className="text-gray-500 text-sm uppercase tracking-wider font-bold">Total Payable</p>
                            <p className="text-2xl font-serif font-black text-black">₹{packageData.pricing.grandTotal.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="p-6 border-2 border-dashed border-gray-200 rounded-2xl text-center">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" className="h-8 mx-auto mb-4 opacity-70" />
                            <p className="text-gray-500 text-sm mb-6">You will be redirected to Razorpay's secure payment gateway to complete your transaction.</p>

                            <button
                                onClick={handlePayment}
                                disabled={processing}
                                className="w-full btn-unified bg-black text-white hover:bg-gray-800 border-black py-4 flex items-center justify-center gap-3 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                            >
                                {processing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Initializing...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                        Pay Securely with Razorpay
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="grid grid-cols-4 gap-4 opacity-50 grayscale pt-4">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 mx-auto" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 mx-auto" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 mx-auto" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Apple_Pay_logo.svg" alt="Apple Pay" className="h-5 mx-auto" />
                        </div>
                    </div>
                </div>

                { }
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="bg-black p-6 text-white">
                            <h2 className="text-xl font-serif font-bold">Trip Summary</h2>
                            <p className="text-gray-400 text-sm">Review your custom itinerary</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex gap-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                    {packageData.stayId.images?.[0] ? <img src={packageData.stayId.images[0]} className="w-full h-full object-cover" /> : null}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase">Accommodation</p>
                                    <h3 className="font-medium text-black">{packageData.stayId?.name}</h3>
                                    <p className="text-sm text-gray-500">{packageData.numberOfDays} Days, {packageData.numberOfPeople} People</p>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 my-4"></div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Stay</span>
                                    <span className="font-medium text-black">₹{packageData.pricing.stayTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Transport</span>
                                    <span className="font-medium text-black">₹{packageData.pricing.transportationTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Sightseeing</span>
                                    <span className="font-medium text-black">₹{packageData.pricing.sightseeingTotal.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 my-4"></div>

                            <div className="flex justify-between items-center text-lg">
                                <span className="font-bold text-gray-900">Total Amount</span>
                                <span className="font-bold text-black border-b-2 border-gold pb-1">₹{packageData.pricing.grandTotal.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gold/10 p-6 rounded-2xl border border-gold/20">
                        <p className="text-sm text-yellow-800 font-medium leading-relaxed">
                            "Travel is the only thing you buy that makes you richer."
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PaymentPage;
