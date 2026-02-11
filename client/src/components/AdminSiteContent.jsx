import { useState, useEffect } from 'react';
import { contentAPI } from '../utils/api';
import { useContent } from '../context/ContentContext';

const AdminSiteContent = () => {
    const { refreshContent } = useContent();
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(null); 

    useEffect(() => {
        fetchContents();
    }, []);

    const fetchContents = async () => {
        try {
            const response = await contentAPI.getAllContent();
            setContents(response.data);
        } catch (error) {
            console.error('Error fetching site content:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = async (key, file) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(key);
        try {
            await contentAPI.updateContent(key, formData);
            await fetchContents(); 
            refreshContent(); 
        } catch (error) {
            console.error('Error updating content:', error);
            alert('Failed to update image');
        } finally {
            setUploading(null);
        }
    };

    
    const groupedContents = contents.reduce((acc, item) => {
        if (!acc[item.section]) {
            acc[item.section] = [];
        }
        acc[item.section].push(item);
        return acc;
    }, {});

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading content...</div>;
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-2xl font-bold font-serif mb-6 text-black">Site Content Management</h2>
            <p className="text-gray-500 mb-8">Update static images across the website.</p>

            <div className="space-y-12">
                {Object.entries(groupedContents).map(([section, items]) => (
                    <div key={section}>
                        <h3 className="text-lg font-bold uppercase tracking-wider text-gray-400 mb-6 border-b pb-2">{section}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {items.map((item) => (
                                <div key={item.key} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4 group">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.label}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gold transition-colors">
                                                <span>{uploading === item.key ? 'Uploading...' : 'Change Image'}</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => handleImageChange(item.key, e.target.files[0])}
                                                    disabled={uploading === item.key}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-black">{item.label}</h4>
                                            <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminSiteContent;
