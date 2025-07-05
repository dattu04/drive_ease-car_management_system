// src/components/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Car, 
  Calendar, 
  MapPin, 
  Wrench,
  ShoppingBag, 
  User, 
  LogOut, 
  Search,
  Phone,
  Clock,
  Star,
} from 'lucide-react';
import '../styles/Home.css';

const Home = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const navigateToDashboard = () => {
    navigate('/Dashboard');
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  // Navigate to Dashboard with specific section active
  const navigateToDashboardSection = (section) => {
    // We can use state to pass the active section to the Dashboard component
    navigate('/dashboard', { state: { activeSection: section } });
  };

  return (
    <div className="home-container">
      {/* Header/Navigation */}
      <header className="home-header">
        <div className="logo-container">
          <h1>DriveEase</h1>
        </div>
        <div className="search-container">
          <div className="search-input-wrapper">
            <Search size={20} className="search-icon" />
            <input type="text" placeholder="Search for cars, parts, services..." className="search-input" />
          </div>
        </div>
        <nav className="home-nav">
          <button className="nav-link" onClick={() => navigateToDashboardSection('featured')}>
            <Car size={18} />
            <span>Vehicles</span>
          </button>
          <button className="nav-link" onClick={() => navigateToDashboardSection('services')}>
            <Wrench size={18} />
            <span>Services</span>
          </button>
          <button className="nav-link" onClick={() => navigateToDashboardSection('parts')}>
            <ShoppingBag size={18} />
            <span>Parts</span>
          </button>
          <button className="nav-link" onClick={() => navigateToDashboardSection('locations')}>
            <MapPin size={18} />
            <span>Locations</span>
          </button>
          <div className="user-controls">
            <button className="user-button" onClick={navigateToDashboard}>
              <User size={18} />
              <span>{user?.name || user?.username || 'Account'}</span>
            </button>
            <button className="logout-button" onClick={handleLogout}>
              <LogOut size={18} />
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to DriveEase</h1>
          <p>Find your perfect ride today</p>
          <div className="hero-buttons">
            <button className="primary-button" onClick={() => navigateToDashboardSection('featured')}>Browse Vehicles</button>
            <button className="secondary-button" onClick={() => navigateToDashboardSection('testdrive')}>Book a Test Drive</button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="features-section">
        <h2>Our Services</h2>
        <div className="feature-cards">
          <div className="feature-card" onClick={() => navigateToDashboardSection('featured')}>
            <Car size={32} className="feature-icon" />
            <h3>Browse Vehicles</h3>
            <p>Explore our collection of premium vehicles</p>
          </div>
          <div className="feature-card" onClick={() => navigateToDashboardSection('testdrive')}>
            <Calendar size={32} className="feature-icon" />
            <h3>Test Drives</h3>
            <p>Schedule a test drive at your convenience</p>
          </div>
          <div className="feature-card" onClick={() => navigateToDashboardSection('services')}>
            <Wrench size={32} className="feature-icon" />
            <h3>Service Center</h3>
            <p>Professional maintenance and repair services</p>
          </div>
          <div className="feature-card" onClick={() => navigateToDashboardSection('parts')}>
            <ShoppingBag size={32} className="feature-icon" />
            <h3>Parts & Accessories</h3>
            <p>Original spare parts and custom accessories</p>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Preview */}
      <section className="vehicles-preview">
        <div className="section-header">
          <h2>Featured Vehicles</h2>
          <button className="view-all-button" onClick={() => navigateToDashboardSection('featured')}>View All</button>
        </div>
        <div className="vehicle-cards">
          {[1, 2, 3].map((item) => (
            <div key={item} className="vehicle-card" onClick={() => navigateToDashboardSection('featured')}>
              <div className="vehicle-image-placeholder"></div>
              <div className="vehicle-details">
                <h3>Premium Sedan {item}</h3>
                <div className="vehicle-specs">
                  <span><Clock size={14} /> 2023</span>
                  <span><Star size={14} /> 4.8/5</span>
                </div>
                <p className="vehicle-price">$35,000</p>
                <button className="details-button">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <h2>What Our Customers Say</h2>
        <div className="testimonials">
          <div className="testimonial-card">
            <div className="stars">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#FFD700" color="#FFD700" />)}
            </div>
            <p>"The service at DriveEase was exceptional. I found my dream car in just one visit!"</p>
            <h4>Sarah Johnson</h4>
          </div>
          <div className="testimonial-card">
            <div className="stars">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#FFD700" color="#FFD700" />)}
            </div>
            <p>"Their maintenance service is top-notch. My car always feels brand new after a service."</p>
            <h4>Michael Brown</h4>
          </div>
          <div className="testimonial-card">
            <div className="stars">
              {[...Array(4)].map((_, i) => <Star key={i} size={16} fill="#FFD700" color="#FFD700" />)}
              <Star size={16} color="#FFD700" />
            </div>
            <p>"The best dealership experience I've had. Transparent pricing and no pressure sales."</p>
            <h4>Emily Davis</h4>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to find your perfect ride?</h2>
          <p>Visit your dashboard to explore all our services</p>
          <button className="cta-button" onClick={navigateToDashboard}>Go to Dashboard</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-column">
            <h3>DriveEase</h3>
            <p>Your trusted partner for all automotive needs.</p>
          </div>
          <div className="footer-column">
            <h3>Quick Links</h3>
            <button className="footer-link" onClick={() => navigateToDashboardSection('featured')}>Vehicles</button>
            <button className="footer-link" onClick={() => navigateToDashboardSection('services')}>Services</button>
            <button className="footer-link" onClick={() => navigateToDashboardSection('parts')}>Parts</button>
            <button className="footer-link" onClick={() => navigateToDashboardSection('testdrive')}>Test Drives</button>
          </div>
          <div className="footer-column">
            <h3>Contact Us</h3>
            <p><Phone size={14} /> (555) 123-4567</p>
            <p><MapPin size={14} /> 123 Auto Drive, Car City</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 DriveEase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;