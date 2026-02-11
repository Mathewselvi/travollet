import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminAPI } from '../../utils/api';

const AdminSightseeingForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(isEditMode);
    const [formData, setFormData] = useState({
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

    useEffect(() => {
        if (isEditMode) {
            fetchSightseeingDetails();
        }
    }, [id]);

    const fetchSightseeingDetails = async () => {
        try {
            const response = await adminAPI.getAllSightseeing();
            const item = response.data.find(s => s._id === id);
            if (item) {
                setFormData({
                    name: item.name,
                    pricePerPerson: item.pricePerPerson,
                    duration: item.duration,
                    description: item.description,
                    location: item.location,
                    images: item.images ? item.images.join(', ') : '',
                    highlights: item.highlights ? item.highlights.join(', ') : '',
                    included: item.included ? item.included.join(', ') : '',
                    isActive: item.isActive,
                    maxSlotsPerDay: item.maxSlotsPerDay || 50
                });
            } else {
                alert('Sightseeing activity not found');
                navigate('/admin/sightseeing');
            }
        } catch (error) {
            console.error('Error fetching sightseeing details:', error);
            alert('Error loading details');
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
            if (images.length < 5) {
                alert('Please provide at least 5 images for the destination');
                return;
            }

            const submitData = {
                ...formData,
                pricePerPerson: parseInt(formData.pricePerPerson),
                images: images,
                highlights: formData.highlights ? formData.highlights.split(',').map(h => h.trim()) : [],
                included: formData.included ? formData.included.split(',').map(i => i.trim()) : [],
                maxSlotsPerDay: parseInt(formData.maxSlotsPerDay) || 50
            };

            if (isEditMode) {
                await adminAPI.updateSightseeing(id, submitData);
                alert('Activity updated successfully');
            } else {
                await adminAPI.createSightseeing(submitData);
                alert('Activity created successfully');
            }
            navigate('/admin/sightseeing');
        } catch (error) {
            alert('Error saving sightseeing activity');
            console.error('Error:', error);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading details...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{isEditMode ? 'Edit Activity' : 'Add New Activity'}</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            {isEditMode ? 'Update tour or activity details.' : 'Create a new tour or sightseeing activity.'}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/admin/sightseeing')}
                        className="text-gray-500 hover:text-black font-medium text-sm flex items-center"
                    >
                        <span className="mr-2">←</span> Back to Sightseeing
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {/* Basic Information */}
                        <div>
                            <h3 className="text-lg font-bold text-black border-b border-gray-100 pb-2 mb-6">Activity Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Activity Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                                        required
                                        placeholder="e.g. Mountain Hiking Adventure"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Duration</label>
                                    <input
                                        type="text"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 2 hours"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Price per Person</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                                        <input
                                            type="number"
                                            name="pricePerPerson"
                                            value={formData.pricePerPerson}
                                            onChange={handleInputChange}
                                            className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                                            required
                                            min="0"
                                        />
                                    </div>
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
                                        placeholder="Meeting point or Area"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div>
                            <h3 className="text-lg font-bold text-black border-b border-gray-100 pb-2 mb-6">Details & Media</h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                                        required
                                        placeholder="Detailed description of the activity..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Highlights</label>
                                    <textarea
                                        name="highlights"
                                        value={formData.highlights}
                                        onChange={handleInputChange}
                                        rows="2"
                                        placeholder="Beautiful views, Historical significance (comma separated)"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">What's Included</label>
                                    <textarea
                                        name="included"
                                        value={formData.included}
                                        onChange={handleInputChange}
                                        rows="2"
                                        placeholder="Guide, Entry tickets, Refreshments (comma separated)"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Images (Min 5)</label>
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
                                    <p className="mt-1 text-xs text-gray-400">5+ images required.</p>
                                </div>
                            </div>
                        </div>

                        {/* Capacity & Status */}
                        <div>
                            <h3 className="text-lg font-bold text-black border-b border-gray-100 pb-2 mb-6">Capacity & Availability</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Daily Capacity</label>
                                    <input
                                        type="number"
                                        name="maxSlotsPerDay"
                                        value={formData.maxSlotsPerDay}
                                        onChange={handleInputChange}
                                        min="1"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                                        required
                                    />
                                    <p className="mt-1 text-[10px] text-gray-400">Max people per day</p>
                                </div>
                                <div className="flex items-center">
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="isActive"
                                            checked={formData.isActive}
                                            onChange={handleInputChange}
                                            className="form-checkbox h-5 w-5 text-black rounded border-gray-300 focus:ring-black"
                                        />
                                        <span className="text-gray-900 font-bold">Available for Booking</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/sightseeing')}
                                className="px-6 py-3 border border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-sm rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-8 py-3 bg-black text-white font-bold uppercase tracking-wider text-sm rounded-lg hover:bg-gold hover:text-black transition-all shadow-lg hover:shadow-xl"
                            >
                                {isEditMode ? 'Update Activity' : 'Create Activity'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminSightseeingForm;
