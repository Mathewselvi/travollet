import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import CustomizePage from './pages/CustomizePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import StayDetails from './pages/StayDetails';
import TransportDetails from './pages/TransportDetails';
import ActivityDetails from './pages/ActivityDetails';
import Destinations from './pages/Destinations';
import Packages from './pages/Packages';
import PackageDetails from './pages/PackageDetails';
import ProtectedRoute from './components/ProtectedRoute';
import PaymentPage from './pages/PaymentPage';
import BookingSuccessPage from './pages/BookingSuccessPage';
import BookingDetailsPage from './pages/BookingDetailsPage';
import PackageBooking from './pages/PackageBooking';
import GalleryPage from './pages/GalleryPage';
import ChatWidget from './components/ChatWidget';
import './App.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!isAdminRoute && <Footer />}
      <ChatWidget />
    </div>
  );
};

import { TripProvider } from './context/TripContext';
import { ContentProvider } from './context/ContentContext';
import { useEffect } from 'react';
import Lenis from 'lenis';

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <AuthProvider>
      <TripProvider>
        <ContentProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/category/:category" element={<CategoryPage />} />
                <Route path="/stays/:id" element={<StayDetails />} />
                <Route path="/transport/:id" element={<TransportDetails />} />
                <Route path="/activity/:id" element={<ActivityDetails />} />
                <Route path="/destinations" element={<Destinations />} />
                <Route path="/packages" element={<Packages />} />
                <Route path="/packages/:id" element={<PackageDetails />} />
                <Route path="/packages/:id/book" element={<PackageBooking />} />
                <Route path="/customize" element={<CustomizePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/payment/:id" element={<PaymentPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/booking-success/:id" element={<BookingSuccessPage />} />
                <Route path="/package/:id" element={<BookingDetailsPage />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Layout>
          </Router>
        </ContentProvider>
      </TripProvider>
    </AuthProvider>
  );
}

export default App;