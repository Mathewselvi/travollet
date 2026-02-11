import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminAPI } from '../../utils/api';

const AdminStayForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(isEditMode);
    const [formData, setFormData] = useState({
        name: '',
        category: 'basic',
        pricePerNight: '',
        maxOccupancy: '',
        location: '',
        description: '',
        amenities: '',
        images: '',
        isActive: true,
        totalRooms: 1
    });

    useEffect(() => {
        if (isEditMode) {
            fetchStayDetails();
        }
    }, [id]);

    const fetchStayDetails = async () => {
        try {
            const response = await adminAPI.getAllStays(); // Ideally should have getStayById, but filtering for now
            const stay = response.data.find(s => s._id === id);
            if (stay) {
                setFormData({
                    name: stay.name,
                    category: stay.category,
                    pricePerNight: stay.pricePerNight,
                    maxOccupancy: stay.maxOccupancy,
                    location: stay.location,
                    description: stay.description || '',
                    amenities: stay.amenities.join(', '),
                    images: stay.images.join(', '),
                    isActive: stay.isActive,
                    totalRooms: stay.totalRooms || 1
                });
            } else {
                alert('Stay not found');
                navigate('/admin/stays');
            }
        } catch (error) {
            console.error('Error fetching stay details:', error);
            alert('Error loading stay details');
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

            const submitData = {
                ...formData,
                pricePerNight: parseInt(formData.pricePerNight),
                maxOccupancy: parseInt(formData.maxOccupancy),
                amenities: formData.amenities ? formData.amenities.split(',').map(a => a.trim()) : [],
                images: images,
                totalRooms: parseInt(formData.totalRooms) || 1
            };

            if (isEditMode) {
                await adminAPI.updateStay(id, submitData);
                alert('Stay updated successfully');
            } else {
                await adminAPI.createStay(submitData);
                alert('Stay created successfully');
            }
            navigate('/admin/stays');
        } catch (error) {
            alert('Error saving stay');
            console.error('Error:', error);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading stay details...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{isEditMode ? 'Edit Stay' : 'Add New Stay'}</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            {isEditMode ? 'Update existing accommodation details.' : 'Create a new accommodation listing.'}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/admin/stays')}
                        className="text-gray-500 hover:text-black font-medium text-sm flex items-center"
                    >
                        <span className="mr-2">←</span> Back to Stays
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {/* Basic Information */}
                        <div>
                            <h3 className="text-lg font-bold text-black border-b border-gray-100 pb-2 mb-6">Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Property Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors text-black placeholder-gray-400"
                                        required
                                        placeholder="e.g. Luxury Ocean Villa"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                                        required
                                    >
                                        <option value="basic">Basic</option>
                                        <option value="premium">Premium</option>
                                        <option value="luxury">Luxury</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                                        required
                                        placeholder="City, Region"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pricing & Capacity */}
                        <div>
                            <h3 className="text-lg font-bold text-black border-b border-gray-100 pb-2 mb-6">Pricing & Capacity</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Price per Night</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                                        <input
                                            type="number"
                                            name="pricePerNight"
                                            value={formData.pricePerNight}
                                            onChange={handleInputChange}
                                            className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                                            required
                                            min="0"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Max Occupancy</label>
                                    <input
                                        type="number"
                                        name="maxOccupancy"
                                        value={formData.maxOccupancy}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                                        required
                                        min="1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Rooms</label>
                                    <input
                                        type="number"
                                        name="totalRooms"
                                        value={formData.totalRooms}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                                        required
                                        min="1"
                                    />
                                    <p className="mt-1 text-[10px] text-gray-400">Total inventory available</p>
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div>
                            <h3 className="text-lg font-bold text-black border-b border-gray-100 pb-2 mb-6">Property Details</h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                                        placeholder="Describe the property..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Amenities</label>
                                    <input
                                        type="text"
                                        name="amenities"
                                        value={formData.amenities}
                                        onChange={handleInputChange}
                                        placeholder="WiFi, AC, TV, Pool, Breakfast (comma separated)"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Image URLs</label>
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
                                <div>
                                    <span className="text-gray-900 font-bold block">Available for Booking</span>
                                    <span className="text-gray-500 text-sm">Unchecking this removes the stay from customer search results.</span>
                                </div>
                            </label>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/stays')}
                                className="px-6 py-3 border border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-sm rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-8 py-3 bg-black text-white font-bold uppercase tracking-wider text-sm rounded-lg hover:bg-gold hover:text-black transition-all shadow-lg hover:shadow-xl"
                            >
                                {isEditMode ? 'Update Stay' : 'Create Stay'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminStayForm;
