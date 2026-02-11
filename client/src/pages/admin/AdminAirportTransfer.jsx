import { useState, useEffect } from 'react';
import { adminAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const AdminAirportTransfer = () => {
    const [transfers, setTransfers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        vehicleType: '',
        price: '',
        description: '',
        maxPassengers: 4,
        isActive: true,
        images: []
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchTransfers();
    }, []);

    const fetchTransfers = async () => {
        try {
            const response = await adminAPI.getAllAirportTransfers();
            setTransfers(response.data);
        } catch (error) {
            console.error('Error fetching transfers:', error);
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
            if (editingId) {
                await adminAPI.updateAirportTransfer(editingId, formData);
            } else {
                await adminAPI.createAirportTransfer(formData);
            }
            fetchTransfers();
            resetForm();
        } catch (error) {
            console.error('Error saving transfer option:', error);
            alert('Failed to save option');
        }
    };

    const handleEdit = (transfer) => {
        setFormData({
            vehicleType: transfer.vehicleType,
            price: transfer.price,
            description: transfer.description || '',
            maxPassengers: transfer.maxPassengers,
            isActive: transfer.isActive,
            images: transfer.images || []
        });
        setEditingId(transfer._id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this option?')) {
            try {
                await adminAPI.deleteAirportTransfer(id);
                fetchTransfers();
            } catch (error) {
                console.error('Error deleting option:', error);
                alert('Failed to delete option');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            vehicleType: '',
            price: '',
            description: '',
            maxPassengers: 4,
            isActive: true,
            images: []
        });
        setEditingId(null);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Manage Airport Transfers</h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold mb-2">Vehicle Type</label>
                        <input
                            type="text"
                            name="vehicleType"
                            value={formData.vehicleType}
                            onChange={handleInputChange}
                            placeholder="e.g. Sedan, SUV"
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Price (₹)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                            min="0"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Max Passengers</label>
                        <input
                            type="number"
                            name="maxPassengers"
                            value={formData.maxPassengers}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            min="1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Description</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold mb-2">Vehicle Images</label>
                        <div className="flex flex-col sm:flex-row gap-2 mb-2">
                            <input
                                type="text"
                                placeholder="Image URL"
                                className="flex-1 p-2 border rounded"
                                id="imageUrlInput"
                            />
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const input = document.getElementById('imageUrlInput');
                                        if (input.value) {
                                            setFormData(prev => ({
                                                ...prev,
                                                images: [...prev.images, input.value]
                                            }));
                                            input.value = '';
                                        }
                                    }}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex-1 sm:flex-none justify-center"
                                >
                                    Add
                                </button>
                                <label className="bg-gray-200 text-black px-4 py-2 rounded cursor-pointer hover:bg-gray-300 flex-1 sm:flex-none flex items-center justify-center">
                                    Upload
                                    <input
                                        type="file"
                                        multiple
                                        className="hidden"
                                        onChange={async (e) => {
                                            const files = Array.from(e.target.files);
                                            if (files.length === 0) return;

                                            try {
                                                const uploadPromises = files.map(file => {
                                                    const formData = new FormData();
                                                    formData.append('image', file);
                                                    return adminAPI.uploadFile(formData);
                                                });

                                                const responses = await Promise.all(uploadPromises);
                                                const imageUrls = responses.map(res => res.data.filePath);

                                                setFormData(prev => ({
                                                    ...prev,
                                                    images: [...prev.images, ...imageUrls]
                                                }));
                                            } catch (error) {
                                                console.error('Upload failed:', error);
                                                alert('Failed to upload images');
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {formData.images.map((img, index) => (
                                <div key={index} className="relative w-20 h-20 group">
                                    <img src={img} alt="Vehicle" className="w-full h-full object-cover rounded" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))}
                                        className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleInputChange}
                                className="mr-2"
                            />
                            Active
                        </label>
                    </div>
                    <div className="md:col-span-2 flex gap-2">
                        <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                            {editingId ? 'Update Vehicle' : 'Add Vehicle'}
                        </button>
                        {editingId && (
                            <button type="button" onClick={resetForm} className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="p-4 font-bold">Vehicle Type</th>
                            <th className="p-4 font-bold">Price</th>
                            <th className="p-4 font-bold">Max Passengers</th>
                            <th className="p-4 font-bold">Status</th>
                            <th className="p-4 font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transfers.map(transfer => (
                            <tr key={transfer._id} className="border-b hover:bg-gray-50">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        {transfer.images && transfer.images[0] && (
                                            <img src={transfer.images[0]} alt={transfer.vehicleType} className="w-12 h-8 object-cover rounded" />
                                        )}
                                        {transfer.vehicleType}
                                    </div>
                                </td>
                                <td className="p-4">₹{transfer.price.toLocaleString()}</td>
                                <td className="p-4">{transfer.maxPassengers}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs ${transfer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {transfer.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button onClick={() => handleEdit(transfer)} className="text-blue-600 hover:text-blue-800 mr-4">Edit</button>
                                    <button onClick={() => handleDelete(transfer._id)} className="text-red-600 hover:text-red-800">Delete</button>
                                </td>
                            </tr>
                        ))}
                        {transfers.length === 0 && (
                            <tr>
                                <td colspan="5" className="p-8 text-center text-gray-500">No airport transfer vehicles found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminAirportTransfer;
