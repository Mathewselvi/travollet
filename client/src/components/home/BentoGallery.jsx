import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { galleryAPI } from '../../utils/api';

const BentoItem = ({ src, alt, className = "", children }) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setImgSrc(src);
        setHasError(false);
    }, [src]);

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            setImgSrc("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop");
        }
    };

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
    const [, setLoading] = useState(true);


    const placeholders = [
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1585942907797-4e3f421495e8?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1615172282427-9a5752d64d57?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1504519632665-26613f15bccc?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1000&auto=format&fit=crop",
    ];

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
            const img = galleryImages[index];
            if (img.imageUrl.startsWith('http')) return img.imageUrl;
            return `${img.imageUrl}`;
        }
        return placeholders[index % placeholders.length];
    };

    const getCaption = (index) => {
        if (galleryImages.length > index) return galleryImages[index].caption;
        return "";
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-6 auto-rows-[250px] w-full gap-0">
            { }
            <BentoItem src={getImage(0)} alt={getCaption(0)} className="col-span-1 md:col-span-1" />
            <BentoItem src={getImage(1)} alt={getCaption(1)} className="col-span-1 md:col-span-1" />
            <BentoItem src={getImage(2)} alt={getCaption(2)} className="col-span-1 md:col-span-1" />

            <div className="col-span-1 md:col-span-1 grid grid-rows-2 gap-0">
                <BentoItem src={getImage(3)} alt={getCaption(3)} className="row-span-1" />
                <BentoItem src={getImage(4)} alt={getCaption(4)} className="row-span-1" />
            </div>

            <BentoItem src={getImage(5)} alt={getCaption(5)} className="col-span-1 md:col-span-1" />
            <BentoItem src={getImage(6)} alt={getCaption(6)} className="col-span-1 md:col-span-1" />

            { }
            <BentoItem src={getImage(7)} alt={getCaption(7)} className="col-span-1 md:col-span-2" />
            <BentoItem src={getImage(8)} alt={getCaption(8)} className="col-span-1 md:col-span-1" />

            { }
            <BentoItem src={getImage(9)} alt={getCaption(9)} className="col-span-1 md:col-span-2 row-span-2 relative">
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-4">
                    <h3 className="text-white text-3xl font-bold uppercase mb-4 tracking-widest font-display"># LET THE TRAVEL BEGIN</h3>
                    <Link to="/gallery" className="btn-unified white text-xs px-6 py-2">View Gallery</Link>
                </div>
            </BentoItem>

            <BentoItem src={getImage(10)} alt={getCaption(10)} className="col-span-1 md:col-span-1" />

            { }
            { }
            <BentoItem src={getImage(11)} alt={getCaption(11)} className="col-span-1 md:col-span-1" />
            <BentoItem src={getImage(12)} alt={getCaption(12)} className="col-span-1 md:col-span-1" />
            <BentoItem src={getImage(13)} alt={getCaption(13)} className="col-span-1 md:col-span-1" /> { }
            { }
            <BentoItem src={getImage(14)} alt={getCaption(14)} className="col-span-1 md:col-span-1" />
        </div>
    );
};

export default BentoGallery;
