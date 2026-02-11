import { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';

const AdminTourPackages = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPackage, setEditingPackage] = useState(null);
    const [stays, setStays] = useState([]);
    const [transportation, setTransportation] = useState([]);
    const [sightseeing, setSightseeing] = useState([]);


    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        image: '',
        stayId: '',
        transportationId: '',
        sightseeingIds: [],
        destinations: '',
        duration: { days: 1, nights: 0 },
        isActive: true
    });

    useEffect(() => {
        fetchPackages();
        fetchResources();
    }, []);

    const fetchPackages = async () => {
        try {
            const response = await adminAPI.getAllTourPackages();
            setPackages(response.data);
        } catch (error) {
            console.error('Error fetching packages:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchResources = async () => {
        try {
            const [staysRes, transRes, sightRes] = await Promise.all([
                adminAPI.getAllStays(),
                adminAPI.getAllTransportation(),
                adminAPI.getAllSightseeing()
            ]);
            setStays(staysRes.data);
            setTransportation(transRes.data);
            setSightseeing(sightRes.data);
        } catch (error) {
            console.error('Error fetching resources:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this package?')) {
            try {
                await adminAPI.deleteTourPackage(id);
                fetchPackages();
            } catch (error) {
                console.error('Error deleting package:', error);
            }
        }
    };

    const handleEdit = (pkg) => {
        setEditingPackage(pkg);
        setFormData({
            title: pkg.title,
            description: pkg.description,
            price: pkg.price,
            image: pkg.image,
            stayId: pkg.stayId?._id || '',
            transportationId: pkg.transportationId?._id || '',
            sightseeingIds: pkg.sightseeingIds.map(s => s._id),
            destinations: pkg.destinations.join(', '),
            duration: pkg.duration,
            isActive: pkg.isActive
        });
        setShowModal(true);
    };

    const handleAddNew = () => {
        setEditingPackage(null);
        setFormData({
            title: '',
            description: '',
            price: '',
            image: '',
            stayId: '',
            transportationId: '',
            sightseeingIds: [],
            destinations: '',
            duration: { days: 1, nights: 0 },
            isActive: true
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                destinations: formData.destinations.split(',').map(d => d.trim()).filter(Boolean),
                stayId: formData.stayId || null,
                transportationId: formData.transportationId || null
            };

            if (editingPackage) {
                await adminAPI.updateTourPackage(editingPackage._id, payload);
            } else {
                await adminAPI.createTourPackage(payload);
            }
            setShowModal(false);
            fetchPackages();
        } catch (error) {
            console.error('Error saving package:', error);
            alert('Failed to save package');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: type === 'number' ? Number(value) : value }
            }));
        } else if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (name === 'sightseeingIds') {


            const options = e.target.options;
            const value = [];
            for (let i = 0, l = options.length; i < l; i++) {
                if (options[i].selected) {
                    value.push(options[i].value);
                }
            }
            setFormData(prev => ({ ...prev, sightseeingIds: value }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const toggleSightseeing = (id) => {
        setFormData(prev => {
            const current = prev.sightseeingIds;
            if (current.includes(id)) {
                return { ...prev, sightseeingIds: current.filter(cid => cid !== id) };
            } else {
                return { ...prev, sightseeingIds: [...current, id] };
            }
        });
    }

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-black">Package Management</h1>
                    <p className="text-gray-500 text-sm">Create and manage predefined tour packages</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    Add New Package
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                    <div key={pkg._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-all duration-300">
                        <div className="h-48 overflow-hidden relative">
                            <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            {!pkg.isActive && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <span className="text-white font-bold tracking-wider border-2 border-white px-4 py-1">INACTIVE</span>
                                </div>
                            )}
                        </div>
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-black mb-2">{pkg.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-4">{pkg.description}</p>

                            <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                                <span>{pkg.duration.days}D / {pkg.duration.nights}N</span>
                                <span className="font-bold text-black text-lg">₹{pkg.price.toLocaleString()}</span>
                            </div>

                            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                                <button onClick={() => handleEdit(pkg)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 text-black">Edit</button>
                                <button onClick={() => handleDelete(pkg._id)} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100">Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold">{editingPackage ? 'Edit Package' : 'Create New Package'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-black">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Package Title</label>
                                        <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                        <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Days</label>
                                            <input type="number" name="duration.days" value={formData.duration.days} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" min="1" required />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nights</label>
                                            <input type="number" name="duration.nights" value={formData.duration.nights} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" min="0" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                        <input type="text" name="image" value={formData.image} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Destinations (comma separated)</label>
                                        <input type="text" name="destinations" value={formData.destinations} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" placeholder="e.g. Paris, London" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleChange} className="rounded text-black focus:ring-black" />
                                        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active (Visible to users)</label>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg h-32" required></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Included Stay</label>
                                        <select name="stayId" value={formData.stayId} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg">
                                            <option value="">Select Stay (Optional)</option>
                                            {stays.map(stay => (
                                                <option key={stay._id} value={stay._id}>{stay.name} - {stay.location}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Included Transportation</label>
                                        <select name="transportationId" value={formData.transportationId} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg">
                                            <option value="">Select Transportation (Optional)</option>
                                            {transportation.map(trans => (
                                                <option key={trans._id} value={trans._id}>{trans.name} ({trans.type})</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Included Sightseeing</label>
                                        <div className="h-32 overflow-y-auto border border-gray-300 rounded-lg p-2 space-y-2">
                                            {sightseeing.map(sight => (
                                                <div key={sight._id} className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.sightseeingIds.includes(sight._id)}
                                                        onChange={() => toggleSightseeing(sight._id)}
                                                        className="rounded text-black focus:ring-black"
                                                    />
                                                    <span className="text-sm">{sight.name} ({sight.location})</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 border border-gray-300 rounded-lg text-black font-medium hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800">
                                    {editingPackage ? 'Update Package' : 'Create Package'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTourPackages;
