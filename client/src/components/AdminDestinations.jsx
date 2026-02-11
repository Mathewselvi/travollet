import { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';

const AdminDestinations = () => {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        description: '',
        type: 'Popular Spot',
        images: '',
        bestTimeToVisit: '',
        isActive: true
    });

    useEffect(() => {
        fetchDestinations();
    }, []);

    const fetchDestinations = async () => {
        try {
            const response = await adminAPI.getAllDestinations();
            setDestinations(response.data);
        } catch (error) {
            console.error('Error fetching destinations:', error);
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
            if (images.length < 1) {
                alert('Please provide at least 1 image');
                return;
            }

            const submitData = {
                ...formData,
                images: images
            };

            if (editing) {
                await adminAPI.updateDestination(editing._id, submitData);
            } else {
                await adminAPI.createDestination(submitData);
            }
            resetForm();
            fetchDestinations();
        } catch (error) {
            alert('Error saving destination');
            console.error('Error:', error);
        }
    };

    const handleEdit = (item) => {
        setEditing(item);
        setFormData({
            name: item.name,
            location: item.location,
            description: item.description,
            type: item.type,
            images: item.images ? item.images.join(', ') : '',
            bestTimeToVisit: item.bestTimeToVisit || '',
            isActive: item.isActive
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this destination?')) {
            try {
                await adminAPI.deleteDestination(id);
                fetchDestinations();
            } catch {
                alert('Error deleting destination');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            location: '',
            description: '',
            type: 'Popular Spot',
            images: '',
            bestTimeToVisit: '',
            isActive: true
        });
        setEditing(null);
        setShowForm(false);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-black">Manage Destinations</h1>
                    <p className="text-gray-500 text-sm">Showcase places like "Popular Spots" or "Hidden Gems"</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-6 py-2 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gold transition-colors duration-300 rounded"
                >
                    Add New Place
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-black">{editing ? 'Edit Place' : 'Add New Place'}</h2>
                            <button onClick={resetForm} className="text-gray-400 hover:text-black text-xl">&times;</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Top Station"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Type</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                                    >
                                        <option value="Popular Spot">Popular Spot</option>
                                        <option value="Hidden Gem">Hidden Gem</option>
                                        <option value="Must Visit">Must Visit</option>
                                        <option value="Nature">Nature</option>
                                        <option value="Adventure">Adventure</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        placeholder="Specific region in Munnar"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Best Time To Visit</label>
                                    <input
                                        type="text"
                                        name="bestTimeToVisit"
                                        value={formData.bestTimeToVisit}
                                        onChange={handleInputChange}
                                        placeholder="e.g. September to March"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Images</label>
                                    <textarea
                                        name="images"
                                        value={formData.images}
                                        onChange={handleInputChange}
                                        rows="2"
                                        placeholder="Comma separated URLs"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors text-black"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="isActive"
                                            checked={formData.isActive}
                                            onChange={handleInputChange}
                                            className="form-checkbox h-5 w-5 text-black rounded border-gray-300 focus:ring-black"
                                        />
                                        <span className="text-gray-700 font-medium">Visible to Users</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-2 border border-gray-200 text-gray-600 font-medium rounded hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-2 bg-black text-white font-medium uppercase tracking-wider rounded hover:bg-gray-800 transition-colors"
                                >
                                    {editing ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                {destinations.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center border border-gray-100 shadow-sm">
                        <div className="text-4xl mb-4">🌄</div>
                        <h3 className="text-lg font-bold text-black mb-2">No Places Added</h3>
                        <p className="text-gray-500 mb-6">Start adding destinations to showcase.</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="text-gold font-bold uppercase tracking-wider text-xs hover:text-black transition-colors"
                        >
                            Add Your First Place
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Place</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Type</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Location</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {destinations.map((item) => (
                                        <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-4">
                                                    <img
                                                        src={item.images[0] || 'https://via.placeholder.com/100'}
                                                        alt={item.name}
                                                        className="w-12 h-12 rounded object-cover"
                                                    />
                                                    <div>
                                                        <div className="font-bold text-black">{item.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded text-xs font-medium border ${item.type === 'Hidden Gem' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                    item.type === 'Popular Spot' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                        'bg-gray-50 text-gray-700 border-gray-100'
                                                    }`}>
                                                    {item.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{item.location}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${item.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                                    }`}>
                                                    {item.isActive ? 'Visible' : 'Hidden'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(item)}
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

export default AdminDestinations;
