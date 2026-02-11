import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Footer = () => {
    return (
        <footer className="bg-black text-white pb-10 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="block mb-6">
                            <img src={logo} alt="Travollet" className="h-40 w-auto brightness-0 invert" />
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Curating extraordinary journeys for the modern explorer. We believe in travel that transforms.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">Facebook</a>
                        </div>
                    </div>

                    {}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Explore</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li><Link to="/destinations" className="hover:text-white transition-colors">Destinations</Link></li>
                            <li><Link to="/packages" className="hover:text-white transition-colors">Packages</Link></li>
                            <li><Link to="/experiences" className="hover:text-white transition-colors">Experiences</Link></li>
                            <li><Link to="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
                        </ul>
                    </div>

                    {}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Company</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                            <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                            <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Newsletter</h4>
                        <p className="text-gray-400 text-sm mb-4">Subscribe to receive travel inspiration and exclusive offers.</p>
                        <form className="flex flex-col space-y-4">
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="bg-transparent border-b border-gray-700 py-2 text-white focus:outline-none focus:border-white transition-colors placeholder-gray-600"
                            />
                            <button className="text-left text-sm font-medium uppercase tracking-widest hover:text-gray-400 transition-colors">
                                Subscribe &rarr;
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center bg-black">
                    <p className="text-gray-600 text-xs mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} Travollet. All rights reserved.
                    </p>
                    <div className="flex space-x-8 text-gray-600 text-xs text-center flex-row">
                        <span>Designed for Travellers</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
