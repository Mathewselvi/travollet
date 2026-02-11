import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-0' : 'bg-transparent py-0'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {}
        <Link to="/" onClick={closeMenu} className="group">
          <img
            src={logo}
            alt="Travollet"
            className={`${isScrolled ? 'h-20' : 'h-40'} w-auto transition-all duration-300 transform group-hover:scale-105 ${!isScrolled ? 'brightness-0 invert' : ''} -mt-3`}
          />
        </Link>

        {}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={`text-sm font-medium tracking-wide uppercase transition-colors duration-300 hover:text-gold ${isScrolled ? 'text-black' : 'text-white'
              }`}
          >
            Home
          </Link>
          <Link
            to="/destinations"
            className={`text-sm font-medium tracking-wide uppercase transition-colors duration-300 hover:text-gold ${isScrolled ? 'text-black' : 'text-white'
              }`}
          >
            Destinations
          </Link>
          <Link
            to="/packages"
            className={`text-sm font-medium tracking-wide uppercase transition-colors duration-300 hover:text-gold ${isScrolled ? 'text-black' : 'text-white'
              }`}
          >
            Packages
          </Link>

          {!isAuthenticated ? (
            <div className="flex items-center space-x-4 ml-6">
              <Link
                to="/login"
                className={`text-sm font-medium tracking-wide uppercase transition-colors duration-300 hover:text-gold ${isScrolled ? 'text-black' : 'text-white'
                  }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`px-6 py-2 border text-sm font-medium tracking-wide uppercase transition-all duration-300 hover:bg-white hover:text-black ${isScrolled
                  ? 'border-black text-black hover:bg-black hover:text-white'
                  : 'border-white text-white hover:bg-white hover:text-black'
                  }`}
              >
                Start Journey
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-4 ml-6">
              <Link
                to="/dashboard"
                className={`text-sm font-medium tracking-wide uppercase transition-colors duration-300 hover:text-gold ${isScrolled ? 'text-black' : 'text-white'
                  }`}
              >
                Dashboard
              </Link>
              <span className={`text-sm font-medium border-l pl-4 ${isScrolled ? 'text-black border-gray-300' : 'text-white border-white/40'}`}>
                {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className={`px-6 py-2 border text-sm font-medium tracking-wide uppercase transition-all duration-300 ${isScrolled
                  ? 'border-black text-black hover:bg-black hover:text-white'
                  : 'border-white text-white hover:bg-white hover:text-black'
                  }`}
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {}
        <button
          onClick={toggleMenu}
          className="md:hidden focus:outline-none"
        >
          <div className="w-6 flex flex-col items-end space-y-1.5">
            <span className={`block w-full h-0.5 transition-colors duration-300 ${isScrolled ? 'bg-black' : 'bg-white'}`}></span>
            <span className={`block w-3/4 h-0.5 transition-colors duration-300 ${isScrolled ? 'bg-black' : 'bg-white'}`}></span>
            <span className={`block w-full h-0.5 transition-colors duration-300 ${isScrolled ? 'bg-black' : 'bg-white'}`}></span>
          </div>
        </button>
      </div>

      {}
      <div
        className={`fixed inset-0 bg-black/95 backdrop-blur-sm z-40 flex flex-col justify-center items-center transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      >
        <button
          onClick={closeMenu}
          className="absolute top-8 right-8 text-white text-4xl font-light hover:text-gold transition-colors"
        >
          &times;
        </button>

        <div className="flex flex-col space-y-8 text-center">
          <Link to="/" onClick={closeMenu} className="text-2xl text-white font-medium uppercase tracking-widest hover:text-gold transition-colors">Home</Link>
          <Link to="/destinations" onClick={closeMenu} className="text-2xl text-white font-medium uppercase tracking-widest hover:text-gold transition-colors">Destinations</Link>
          <Link to="/packages" onClick={closeMenu} className="text-2xl text-white font-medium uppercase tracking-widest hover:text-gold transition-colors">Packages</Link>

          {!isAuthenticated ? (
            <>
              <Link to="/login" onClick={closeMenu} className="text-xl text-gray-300 hover:text-white transition-colors mt-8">Login</Link>
              <Link to="/register" onClick={closeMenu} className="text-xl text-gold hover:text-white transition-colors">Start Journey</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" onClick={closeMenu} className="text-2xl text-gold font-medium uppercase tracking-widest hover:text-white transition-colors mt-4">Dashboard</Link>
              <button onClick={handleLogout} className="text-xl text-gray-400 hover:text-white transition-colors mt-8">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;