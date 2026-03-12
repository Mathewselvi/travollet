import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Map, Package, Sliders, ShieldCheck, Sparkles, X, ArrowRight } from 'lucide-react';
import { galleryAPI } from '../utils/api';

const introSteps = [
    {
        id: 1,
        icon: Compass,
        title: "Welcome to Travollet",
        description: "Step into a world of unparalleled elegance. Let us guide you through a platform designed to seamlessly craft your ultimate luxury adventure.",
        image: "https://images.unsplash.com/photo-1542314831-c6a4d27160c9?q=80&w=2000&auto=format&fit=crop"
    },
    {
        id: 2,
        icon: Map,
        title: "Explore the Extraordinary",
        description: "Roam freely through our curated Packages, breathtaking Destinations, and immersive Gallery. Discover journeys tailored to Basic, Premium, or Luxury styles.",
        image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000&auto=format&fit=crop"
    },
    {
        id: 3,
        icon: Package,
        title: "Curated Experiences",
        description: "Browse expertly crafted itineraries. Every package provides a full breakdown of magnificent stays, private transportation, and unique sightseeing activities.",
        image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2000&auto=format&fit=crop"
    },
    {
        id: 4,
        icon: Sliders,
        title: "Unbound Customization",
        description: "Have a unique vision? The 'Customize Trip' feature empowers you to build a journey from scratch. Tailor every detail exclusively for you.",
        image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=2000&auto=format&fit=crop"
    },
    {
        id: 5,
        icon: ShieldCheck,
        title: "Seamless Booking",
        description: "Securely book your dream trip with a few clicks. Manage your travel details and connect with our dedicated support team from your personalized dashboard.",
        image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2000&auto=format&fit=crop"
    },
    {
        id: 6,
        icon: Sparkles,
        title: "Your Journey Begins",
        description: "A world of unforgettable memories awaits. Let the travel begin and turn your grandest travel dreams into reality.",
        image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop"
    }
];

const IntroGuide = () => {
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [galleryImages, setGalleryImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await galleryAPI.getAllImages();
                if (response.data && response.data.length > 0) {
                    setGalleryImages(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch gallery images for intro:", error);
            }
        };
        
        const hasSeenIntro = localStorage.getItem('travollet_intro_seen');
        
        // Only trigger the intro on the home page and only if they haven't seen it yet
        if (!hasSeenIntro && location.pathname === '/') {
            fetchImages();
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [location.pathname]);

    const handleNext = () => {
        if (currentStep < introSteps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleComplete();
        }
    };

    const handleComplete = () => {
        setIsVisible(false);
        localStorage.setItem('travollet_intro_seen', 'true');
    };

    const skipIntro = () => {
        setIsVisible(false);
        localStorage.setItem('travollet_intro_seen', 'true');
    };

    if (!isVisible) return null;

    const StepIcon = introSteps[currentStep].icon;
    const bgImage = galleryImages.length > 0
        ? galleryImages[currentStep % galleryImages.length].imageUrl
        : introSteps[currentStep].image;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="fixed inset-0 z-[9999] flex flex-col justify-end md:justify-center items-center bg-black overflow-hidden font-sans"
                >
                    {/* Immersive Background Images */}
                    <div className="absolute inset-0 w-full h-full">
                        <AnimatePresence>
                            <motion.img
                                key={currentStep}
                                src={bgImage}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                className="absolute inset-0 w-full h-full object-cover"
                                alt="Travel Landscape"
                            />
                        </AnimatePresence>
                        {/* Dark overlay for perfect text legibility */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/30 md:bg-black/40 transition-all duration-1000" />
                    </div>

                    {/* Skip Button (Prominent & Stylish) */}
                    <button
                        onClick={skipIntro}
                        className="absolute top-8 right-6 md:right-10 z-50 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white text-xs md:text-sm font-bold tracking-[0.2em] uppercase rounded-full transition-all duration-500 flex items-center group shadow-2xl overflow-hidden"
                    >
                        <span className="relative z-10 transition-transform duration-300 group-hover:-translate-x-1">Skip Intro</span>
                        <X className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 transition-all duration-300 relative z-10 transform translate-x-2 group-hover:translate-x-0" />

                        {/* Hover shine effect */}
                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                    </button>

                    {/* Progress Indicator (Top thin line) */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-white/10 z-50">
                        <motion.div
                            className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.7)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentStep + 1) / introSteps.length) * 100}%` }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                        />
                    </div>

                    {/* Main Content Glass Card */}
                    <motion.div
                        initial={{ y: 80, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.3, type: "spring", stiffness: 50 }}
                        className="relative z-10 w-full max-w-3xl p-4 md:p-6 w-11/12 md:w-full mb-8 md:mb-0"
                    >
                        <div className="bg-transparent p-6 md:p-10 overflow-hidden relative group">
                            {/* Reflection effect */}
                            <div className="absolute top-0 left-0 w-full h-full pointer-events-none" />

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -30 }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                    className="relative z-20"
                                >
                                    <div className="inline-flex items-center justify-center p-3 md:p-4 bg-white/5 rounded-2xl border border-white/10 mb-6 md:mb-8 shadow-inner">
                                        <StepIcon className="w-6 h-6 md:w-8 md:h-8 text-white" strokeWidth={1.5} />
                                    </div>

                                    <h2 className="text-3xl md:text-5xl lg:text-5xl font-serif font-bold text-white mb-4 md:mb-6 leading-tight tracking-tight drop-shadow-xl">
                                        {introSteps[currentStep].title}
                                    </h2>

                                    <p className="text-gray-300 text-base md:text-xl leading-relaxed max-w-3xl font-light drop-shadow-md">
                                        {introSteps[currentStep].description}
                                    </p>
                                </motion.div>
                            </AnimatePresence>

                            <div className="mt-8 md:mt-12 flex flex-col md:flex-row items-center justify-between gap-6 relative z-20 border-t border-white/10 pt-6 md:pt-8">
                                {/* Step dots */}
                                <div className="flex space-x-3 w-full md:w-auto justify-center">
                                    {introSteps.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`h-1.5 rounded-full transition-all duration-700 ${idx === currentStep ? 'w-12 bg-white shadow-[0_0_10px_rgba(255,255,255,1)]' : 'w-2 bg-white/20'}`}
                                        />
                                    ))}
                                </div>

                                {/* Next / Start Button */}
                                <button
                                    onClick={handleNext}
                                    className="px-8 py-3 md:px-10 md:py-4 bg-transparent border-2 border-white text-white font-bold tracking-[0.2em] uppercase text-xs md:text-sm hover:bg-white hover:text-black transition-colors duration-300 w-full md:w-auto mt-4 md:mt-0"
                                >
                                    {currentStep === introSteps.length - 1 ? "Start Exploring" : "Continue"}
                                </button>
                            </div>
                        </div>
                    </motion.div>

                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default IntroGuide;
