import { useState, useEffect } from 'react';
import { galleryAPI } from '../utils/api';
import { useContent } from '../context/ContentContext';

const GalleryPage = () => {
    const { content } = useContent();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);

    const openLightbox = (index) => {
        setSelectedImageIndex(index);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setSelectedImageIndex(null);
        document.body.style.overflow = 'unset';
    };

    const nextImage = (e) => {
        e?.stopPropagation();
        if (selectedImageIndex === null) return;
        setSelectedImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e) => {
        e?.stopPropagation();
        if (selectedImageIndex === null) return;
        setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (selectedImageIndex === null) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImageIndex]);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const response = await galleryAPI.getAllImages();


            const shuffledImages = [...response.data].map(img => ({
                ...img,
                imageUrl: img.imageUrl?.replace('http://localhost:5001', '')
            }));
            for (let i = shuffledImages.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledImages[i], shuffledImages[j]] = [shuffledImages[j], shuffledImages[i]];
            }
            setImages(shuffledImages);
        } catch (error) {
            console.error('Error fetching gallery images:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-xl font-light text-gray-400 tracking-[0.2em] animate-pulse">
                    LOADING MOMENTS...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            { }
            <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden flex items-center justify-center">
                { }
                <div className="absolute inset-0 z-0">
                    <img
                        src={content.gallery_hero_bg || "https://images.unsplash.com/photo-1500835556837-99ac94a94552?q=80&w=1920&auto=format&fit=crop"}
                        alt="Gallery Hero"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>

                { }
                <div className="relative z-10 max-w-[1400px] mx-auto px-6 text-center text-white">
                    <span className="text-sm font-bold text-gold uppercase tracking-[0.2em] mb-4 block animate-fadeInUp">Visual Stories</span>
                    <h1 className="text-5xl md:text-7xl font-bold font-serif mb-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>Our Gallery</h1>
                    <p className="text-gray-200 text-xl font-light max-w-2xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                        A curated collection of moments from our travelers' journeys. Explore the world through their eyes.
                    </p>
                </div>
            </div>

            {/* Masonry Grid */}
            <div className="max-w-[1400px] mx-auto px-6 py-16">
                {images.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">No images in our gallery yet. Be the first to add one!</p>
                    </div>
                ) : (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                        {images.map((image, index) => (
                            <div
                                key={image._id}
                                className="break-inside-avoid group relative rounded-2xl overflow-hidden cursor-zoom-in"
                                onClick={() => openLightbox(index)}
                            >
                                <img
                                    src={`${image.imageUrl}`}
                                    alt={image.caption || 'Travel Moment'}
                                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop'; }}
                                />

                                { }
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                    {image.caption && (
                                        <p className="text-white font-medium text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            {image.caption}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>


            { }
            {
                selectedImageIndex !== null && images[selectedImageIndex] && (
                    <div
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
                        onClick={closeLightbox}
                    >
                        <button
                            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-[60]"
                            onClick={closeLightbox}
                        >
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <button
                            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors bg-black/20 hover:bg-black/40 p-2 rounded-full backdrop-blur-md z-[60]"
                            onClick={prevImage}
                        >
                            <svg className="w-8 h-8 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </button>

                        <button
                            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors bg-black/20 hover:bg-black/40 p-2 rounded-full backdrop-blur-md z-[60]"
                            onClick={nextImage}
                        >
                            <svg className="w-8 h-8 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                        </button>

                        <div
                            className="relative max-w-full max-h-full flex flex-col items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={`${images[selectedImageIndex].imageUrl}`}
                                alt={images[selectedImageIndex].caption}
                                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                            />
                            {images[selectedImageIndex].caption && (
                                <p className="text-white/90 text-lg md:text-xl font-light mt-6 text-center max-w-2xl leading-relaxed">
                                    {images[selectedImageIndex].caption}
                                </p>
                            )}
                            <p className="text-white/40 text-sm mt-2 font-mono">
                                {selectedImageIndex + 1} / {images.length}
                            </p>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default GalleryPage;
