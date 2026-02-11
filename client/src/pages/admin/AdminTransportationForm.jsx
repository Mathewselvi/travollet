import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminAPI } from '../../utils/api';

const AdminTransportationForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(isEditMode);
    const [formData, setFormData] = useState({
        name: '',
        type: 'bike_rental',
        pricePerDay: '',
        description: '',
        features: '',
        images: '',
        isActive: true,
        totalQuantity: 1
    });

    useEffect(() => {
        if (isEditMode) {
            fetchTransportationDetails();
        }
    }, [id]);

    const fetchTransportationDetails = async () => {
        try {
            const response = await adminAPI.getAllTransportation();
            const item = response.data.find(t => t._id === id);
            if (item) {
                setFormData({
                    name: item.name,
                    type: item.type,
                    pricePerDay: item.pricePerDay,
                    description: item.description || '',
                    features: item.features ? item.features.join(', ') : '',
                    images: item.images ? item.images.join(', ') : '',
                    isActive: item.isActive,
                    totalQuantity: item.totalQuantity || 1
                });
            } else {
                alert('Transportation not found');
                navigate('/admin/transportation');
            }
        } catch (error) {
            console.error('Error fetching transportation details:', error);
            alert('Error loading transportation details');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const images = formData.images ? formData.images.split(',').map(i => i.trim()).filter(i => i) : [];
            if (images.length < 3) {
                alert('Please provide at least 3 images for transportation');
                return;
            }

            const submitData = {
                ...formData,
                pricePerDay: parseInt(formData.pricePerDay),
                features: formData.features ? formData.features.split(',').map(f => f.trim()) : [],
                images: images,
                totalQuantity: parseInt(formData.totalQuantity) || 1
            };

            if (isEditMode) {
                await adminAPI.updateTransportation(id, submitData);
                alert('Transportation updated successfully');
            } else {
                await adminAPI.createTransportation(submitData);
                alert('Transportation created successfully');
            }
            navigate('/admin/transportation');
        } catch (error) {
            alert('Error saving transportation');
            console.error('Error:', error);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading details...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{isEditMode ? 'Edit Transport' : 'Add New Transport'}</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            {isEditMode ? 'Update vehicle details.' : 'Add a new vehicle to the fleet.'}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/admin/transportation')}
                        className="text-gray-500 hover:text-black font-medium text-sm flex items-center"
                    >
                        <span className="mr-2">←</span> Back to Transportation
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {/* Basic Information */}
                        <div>
                            <h3 className="text-lg font-bold text-black border-b border-gray-100 pb-2 mb-6">Vehicle Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Vehcile Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                                        required
                                        placeholder="e.g. Royal Enfield Classic 350"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Type</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                                        required
                                    >
                                        <option value="bike_rental">Bike Rental</option>
                                        <option value="scooter_rental">Scooter Rental</option>
                                        <option value="cab_with_driver">Cab with Driver</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Price per Day</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                                        <input
                                            type="number"
                                            name="pricePerDay"
                                            value={formData.pricePerDay}
                                            onChange={handleInputChange}
                                            className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                                            required
                                            min="0"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Units</label>
                                    <input
                                        type="number"
                                        name="totalQuantity"
                                        value={formData.totalQuantity}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                                        required
                                        min="1"
                                    />
                                    <p className="mt-1 text-[10px] text-gray-400">Total fleet size</p>
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div>
                            <h3 className="text-lg font-bold text-black border-b border-gray-100 pb-2 mb-6">Details & Media</h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Features</label>
                                    <input
                                        type="text"
                                        name="features"
                                        value={formData.features}
                                        onChange={handleInputChange}
                                        placeholder="GPS, Insurance, Helmet Included (comma separated)"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                                        placeholder="Vehicle condition, rules, etc."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Images (Min 3)</label>
                                    <textarea
                                        name="images"
                                        value={formData.images}
                                        onChange={handleInputChange}
                                        rows="4"
                                        placeholder="Comma separated URLs"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                                        required
                                    />
                                    <div className="mt-2 flex items-center gap-4">
                                        <input
                                            type="file"
                                            id="imageUpload"
                                            className="hidden"
                                            accept="image/*"
                                            multiple
                                            onChange={async (e) => {
                                                const files = Array.from(e.target.files);
                                                if (files.length === 0) return;

                                                const formDataUpload = new FormData();
                                                files.forEach(file => {
                                                    formDataUpload.append('images', file);
                                                });

                                                try {
                                                    const res = await adminAPI.uploadFile(formDataUpload);
                                                    if (res.data.images && res.data.images.length > 0) {
                                                        const newUrls = res.data.images.map(img => img.imageUrl).join(', ');
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            images: prev.images ? `${prev.images}, ${newUrls}` : newUrls
                                                        }));
                                                    }
                                                } catch (error) {
                                                    console.error('Upload failed:', error);
                                                    alert('Image upload failed');
                                                }
                                            }}
                                        />
                                        <label
                                            htmlFor="imageUpload"
                                            className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 text-xs font-bold uppercase tracking-wider rounded hover:bg-gray-300 transition-colors"
                                        >
                                            Upload Image from Device
                                        </label>
                                        <p className="text-xs text-gray-400">Supported formats: JPG, PNG, WEBP</p>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-400">3+ images required.</p>
                                </div>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="pt-6 border-t border-gray-100">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                    className="form-checkbox h-5 w-5 text-black rounded border-gray-300 focus:ring-black"
                                />
                                <span className="text-gray-900 font-bold block">Available for Booking</span>
                            </label>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/transportation')}
                                className="px-6 py-3 border border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-sm rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-8 py-3 bg-black text-white font-bold uppercase tracking-wider text-sm rounded-lg hover:bg-gold hover:text-black transition-all shadow-lg hover:shadow-xl"
                            >
                                {isEditMode ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminTransportationForm;
