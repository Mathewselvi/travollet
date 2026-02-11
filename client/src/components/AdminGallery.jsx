import { useState, useEffect } from 'react';
import { adminAPI, galleryAPI } from '../utils/api';

const AdminGallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [caption, setCaption] = useState('');
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const response = await galleryAPI.getAllImages();
            setImages(response.data);
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || file.length === 0) return;

        const formData = new FormData();

        for (let i = 0; i < file.length; i++) {
            formData.append('images', file[i]);
        }
        formData.append('caption', caption);

        setUploading(true);
        try {
            await adminAPI.uploadImage(formData);

            setFile(null);
            setCaption('');

            e.target.reset();


            fetchImages();
            alert('Images uploaded successfully!');
        } catch (error) {
            console.error('Upload error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to upload images.';
            alert(`Error: ${errorMessage}`);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;

        try {
            await adminAPI.deleteImage(id);
            setImages(images.filter(img => img._id !== id));
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete image.');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading gallery...</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-black mb-2">Gallery Management</h1>
                    <p className="text-gray-500">Upload and manage images for the public gallery.</p>
                </div>
            </div>

            { }
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Upload New Images</h2>
                <form onSubmit={handleUpload} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Images (Max 20)</label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => setFile(e.target.files)}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gold file:text-white hover:file:bg-black"
                            required
                        />
                    </div>
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Caption (Optional, applied to all)</label>
                        <input
                            type="text"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="Enter image caption"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={uploading || !file || file.length === 0}
                        className={`px-6 py-2 rounded-lg font-bold uppercase tracking-wider text-sm transition-all ${uploading || !file || file.length === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-black text-white hover:bg-gray-800'
                            }`}
                    >
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </form>
            </div>

            { }
            <h2 className="text-xl font-bold mb-4">Existing Images ({images.length})</h2>
            {images.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-400">
                    No images in gallery yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {images.map((image) => (
                        <div key={image._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
                            <div className="relative aspect-square overflow-hidden bg-gray-100">
                                <img
                                    src={`${image.imageUrl}`}
                                    alt={image.caption || 'Gallery Image'}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=Image+Not+Found'; }}
                                />
                                <button
                                    onClick={() => handleDelete(image._id)}
                                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                                    title="Delete Image"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                            <div className="p-4">
                                <p className="text-sm font-medium text-gray-900 truncate">{image.caption || 'No Caption'}</p>
                                <p className="text-xs text-gray-500 mt-1">Uploaded: {new Date(image.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminGallery;
