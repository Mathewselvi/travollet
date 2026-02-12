import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { galleryAPI } from '../../utils/api';

const BentoItem = ({ src, alt, className = "", children }) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setImgSrc(src);
        setHasError(false);
    }, [src]);

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            setImgSrc(null);
        }
    };

    if (!imgSrc && !children) return null;

    return (
        <div className={`relative group overflow-hidden ${className}`}>
            {imgSrc && (
                <img
                    src={imgSrc}
                    alt={alt || "Gallery Image"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={handleError}
                />
            )}
            {children}
        </div>
    );
};

const BentoGallery = () => {
    const [galleryImages, setGalleryImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await galleryAPI.getAllImages();
                setGalleryImages(response.data || []);
            } catch (error) {
                console.error("Failed to fetch gallery images:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    const getImage = (index) => {
        if (galleryImages.length > index) {
            return galleryImages[index].imageUrl;
        }
        return null;
    };

    const getCaption = (index) => {
        if (galleryImages.length > index) return galleryImages[index].caption;
        return "";
    };

    if (loading) return null;

    // If no images uploaded yet, show a minimal CTA
    if (galleryImages.length === 0) {
        return (
            <div className="w-full py-20 bg-gray-50 flex flex-col items-center justify-center text-center px-6">
                <h3 className="text-black text-3xl font-bold uppercase mb-4 tracking-widest font-display"># LET THE TRAVEL BEGIN</h3>
                <p className="text-gray-400 mb-6 font-light">Our gallery is being curated. Check back soon for stunning travel moments.</p>
                <Link to="/gallery" className="btn-unified text-xs px-6 py-2">View Gallery</Link>
            </div>
        );
    }

    // If we have enough images for the full bento layout (15+)
    if (galleryImages.length >= 15) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-6 auto-rows-[250px] w-full gap-0">
                <BentoItem src={getImage(0)} alt={getCaption(0)} className="col-span-1 md:col-span-1" />
                <BentoItem src={getImage(1)} alt={getCaption(1)} className="col-span-1 md:col-span-1" />
                <BentoItem src={getImage(2)} alt={getCaption(2)} className="col-span-1 md:col-span-1" />

                <div className="col-span-1 md:col-span-1 grid grid-rows-2 gap-0">
                    <BentoItem src={getImage(3)} alt={getCaption(3)} className="row-span-1" />
                    <BentoItem src={getImage(4)} alt={getCaption(4)} className="row-span-1" />
                </div>

                <BentoItem src={getImage(5)} alt={getCaption(5)} className="col-span-1 md:col-span-1" />
                <BentoItem src={getImage(6)} alt={getCaption(6)} className="col-span-1 md:col-span-1" />

                <BentoItem src={getImage(7)} alt={getCaption(7)} className="col-span-1 md:col-span-2" />
                <BentoItem src={getImage(8)} alt={getCaption(8)} className="col-span-1 md:col-span-1" />

                <BentoItem src={getImage(9)} alt={getCaption(9)} className="col-span-1 md:col-span-2 row-span-2 relative">
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-4">
                        <h3 className="text-white text-3xl font-bold uppercase mb-4 tracking-widest font-display"># LET THE TRAVEL BEGIN</h3>
                        <Link to="/gallery" className="btn-unified white text-xs px-6 py-2">View Gallery</Link>
                    </div>
                </BentoItem>

                <BentoItem src={getImage(10)} alt={getCaption(10)} className="col-span-1 md:col-span-1" />

                <BentoItem src={getImage(11)} alt={getCaption(11)} className="col-span-1 md:col-span-1" />
                <BentoItem src={getImage(12)} alt={getCaption(12)} className="col-span-1 md:col-span-1" />
                <BentoItem src={getImage(13)} alt={getCaption(13)} className="col-span-1 md:col-span-1" />
                <BentoItem src={getImage(14)} alt={getCaption(14)} className="col-span-1 md:col-span-1" />
            </div>
        );
    }

    // For fewer images, use a simpler responsive grid
    return (
        <div className="w-full">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[250px] w-full gap-0">
                {galleryImages.map((img, index) => (
                    <BentoItem
                        key={img._id}
                        src={img.imageUrl}
                        alt={img.caption || "Gallery Image"}
                        className="col-span-1"
                    />
                ))}
                {/* CTA tile */}
                <div className="col-span-1 relative bg-black/90 flex flex-col items-center justify-center text-center p-4">
                    <h3 className="text-white text-xl font-bold uppercase mb-3 tracking-widest font-display"># LET THE TRAVEL BEGIN</h3>
                    <Link to="/gallery" className="btn-unified white text-xs px-6 py-2">View Gallery</Link>
                </div>
            </div>
        </div>
    );
};

export default BentoGallery;
