import { Link } from 'react-router-dom';
import Marquee from '../components/common/Marquee';
import BentoGallery from '../components/home/BentoGallery';
import { useEffect, useRef } from 'react';
import { useContent } from '../context/ContentContext';
import philosophyImage from '../assets/philosophy.jpg';

const HomePage = () => {
  const { content } = useContent();
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    const hiddenElements = document.querySelectorAll('.reveal-on-scroll');
    hiddenElements.forEach((el) => observerRef.current.observe(el));

    return () => {
      if (observerRef.current) {
        hiddenElements.forEach((el) => observerRef.current.unobserve(el));
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {}
      <section className="relative h-screen w-full overflow-hidden">
        {}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={content.home_hero_bg || "https://images.unsplash.com/photo-1580818135730-ebd11086660b?q=80&w=2314&auto=format&fit=crop"}
            alt="Travel Background"
            className="w-full h-full object-cover animate-ken-burns"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {}
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 reveal-on-scroll">
          <h1 className="text-4xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6">
            DISCOVER YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">NEXT ADVENTURE</span>
          </h1>
          <p className="text-gray-200 text-lg md:text-xl max-w-2xl mb-10 font-light">
            Curated luxury travel experiences crafted to create unforgettable memories.
            Explore the world with unparalleled elegance.
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            <Link
              to="/destinations"
              className="btn-unified white"
            >
              Explore Destinations
            </Link>
          </div>
        </div>
      </section>

      {}
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex justify-between items-end mb-16 reveal-on-scroll">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-2 uppercase tracking-wide">Your Journey Style</h2>
              <p className="text-gray-500 font-light text-lg">Choose the perfect way to explore the world.</p>
            </div>
            <Link to="/packages" className="btn-unified hidden md:inline-flex items-center">
              View All <span className="ml-2">&rarr;</span>
            </Link>
          </div>

          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 md:grid md:grid-cols-3 md:gap-10 pb-8 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0 hide-scrollbar">
            {}
            <Link to="/category/basic" className="flex-none w-[85vw] md:w-auto snap-center group cursor-pointer relative h-[450px] md:h-[500px] overflow-hidden rounded-[30px] md:rounded-[40px] reveal-on-scroll transition-all duration-500 hover:shadow-2xl">
              <div className="absolute inset-0">
                <img
                  src={content.home_category_basic || "https://images.unsplash.com/photo-1629813538702-64c925934e19?q=80&w=4000&auto=format&fit=crop"}
                  alt="Basic"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
              </div>
              <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full text-white transform transition-transform duration-500 translate-y-8 group-hover:translate-y-0">
                <span className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-3 block">Essential</span>
                <h3 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4 font-serif">Basic Explorer</h3>
                <p className="text-gray-200 text-sm md:text-base mb-6 md:mb-8 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 leading-relaxed font-light">
                  Perfect for adventurers who value experiences over extravagance. Authentic and grounded.
                </p>
                <div className="flex items-center space-x-3 text-sm font-medium opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                  <span className="uppercase tracking-widest border-b border-transparent group-hover:border-white transition-all pb-1">Explore Basic</span>
                  <span>&rarr;</span>
                </div>
              </div>
            </Link>

            {}
            <Link to="/category/premium" className="flex-none w-[85vw] md:w-auto snap-center group cursor-pointer relative h-[450px] md:h-[500px] overflow-hidden rounded-[30px] md:rounded-[40px] reveal-on-scroll transition-all duration-500 hover:shadow-2xl" style={{ transitionDelay: '100ms' }}>
              <div className="absolute inset-0">
                <img
                  src={content.home_category_premium || "https://images.unsplash.com/photo-1686376351261-7a1d6e6e2939?q=80&w=1335&auto=format&fit=crop"}
                  alt="Premium"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
              </div>
              <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full text-white transform transition-transform duration-500 translate-y-8 group-hover:translate-y-0">
                <span className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-3 block">Elevated</span>
                <h3 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4 font-serif">Premium Comfort</h3>
                <p className="text-gray-200 text-sm md:text-base mb-6 md:mb-8 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 leading-relaxed font-light">
                  A perfect balance of comfort and adventure. Carefully selected stays with enhanced amenities.
                </p>
                <div className="flex items-center space-x-3 text-sm font-medium opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                  <span className="uppercase tracking-widest border-b border-transparent group-hover:border-white transition-all pb-1">Explore Premium</span>
                  <span>&rarr;</span>
                </div>
              </div>
            </Link>

            {}
            <Link to="/category/luxury" className="flex-none w-[85vw] md:w-auto snap-center group cursor-pointer relative h-[450px] md:h-[500px] overflow-hidden rounded-[30px] md:rounded-[40px] reveal-on-scroll transition-all duration-500 hover:shadow-2xl" style={{ transitionDelay: '200ms' }}>
              <div className="absolute inset-0">
                <img
                  src={content.home_category_luxury || "https://images.unsplash.com/photo-1663597676642-6a3d7afdbff3?q=80&w=1287&auto=format&fit=crop"}
                  alt="Luxury"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
              </div>
              <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full text-white transform transition-transform duration-500 translate-y-8 group-hover:translate-y-0">
                <span className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-3 block">Exclusive</span>
                <h3 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4 font-serif">Luxury Elite</h3>
                <p className="text-gray-200 text-sm md:text-base mb-6 md:mb-8 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 leading-relaxed font-light">
                  Unparalleled service and world-class accommodations. For those who seek the extraordinary.
                </p>
                <div className="flex items-center space-x-3 text-sm font-medium opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                  <span className="uppercase tracking-widest border-b border-transparent group-hover:border-white transition-all pb-1">Explore Luxury</span>
                  <span>&rarr;</span>
                </div>
              </div>
            </Link>
          </div>

          <div className="mt-12 text-center md:hidden reveal-on-scroll">
            <Link to="/packages" className="btn-unified">
              View All <span className="ml-2">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {}
      <section className="py-32 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-20">
            <div className="w-full md:w-1/2 reveal-on-scroll">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-[0.2em] mb-6 block">Our Philosophy</span>
              <h2 className="text-4xl md:text-6xl font-bold text-black mb-8 leading-tight font-serif">
                Crafting Unforgettable <br />
                <span className="text-gray-400">Travel Experiences</span>
              </h2>
              <p className="text-gray-600 text-xl mb-12 leading-relaxed font-light">
                We believe that travel is more than just moving from one place to another. It's about immersion, connection, and transformation.
                With over a decade of expertise in luxury travel, we curate journeys that go beyond the ordinary.
              </p>
              <div className="flex gap-16">
                <div>
                  <h4 className="text-5xl font-bold text-black mb-2 font-serif">500+</h4>
                  <p className="text-gray-400 uppercase text-xs tracking-widest font-bold">Journeys Created</p>
                </div>
                <div>
                  <h4 className="text-5xl font-bold text-black mb-2 font-serif">50+</h4>
                  <p className="text-gray-400 uppercase text-xs tracking-widest font-bold">Destinations</p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 relative reveal-on-scroll" style={{ transitionDelay: '200ms' }}>
              <div className="absolute -top-12 -left-12 w-24 h-24 bg-gray-200 rounded-full z-0 opacity-50"></div>
              <div className="absolute -bottom-12 -right-12 w-32 h-32 border-2 border-gray-200 rounded-full z-0 opacity-50"></div>
              <img
                src={content.home_philosophy_bg || philosophyImage}
                alt="Our Story"
                className="relative z-10 w-full h-[700px] object-cover rounded-[30px] shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="bg-white pt-0 pb-0">
        <div className="w-full reveal-on-scroll">
          <BentoGallery />
        </div>
      </section>

      {/* Marquee Section */}
      <section className="bg-white">
        <Marquee text="#LET THE TRAVEL BEGIN" className="" />
      </section>
    </div>
  );
};

export default HomePage;