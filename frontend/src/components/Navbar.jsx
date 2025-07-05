import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../assets/drive.jpg'  ;

function AppleNavbar() {
  const [searchVisible, setSearchVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="apple-navbar">
      <div className="nav-container">
        <button 
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <div className={`mobile-menu-icon ${mobileMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        <Link to="/" className="nav-logo">
          <img src={logo} alt="AutoHub" className="nav-logo-image" />
        </Link>

        <ul className="nav-links">
          <li><Link to="/vehicles">Vehicles</Link></li>
          <li><Link to="/accessories">Accessories</Link></li>
          <li><Link to="/service">Service</Link></li>
          <li><Link to="/financing">Financing</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/support">Support</Link></li>
        </ul>

        <div className="nav-actions">
          <div className="nav-search">
            <button 
              className="search-button"
              onClick={toggleSearch}
              aria-label="Search"
            >
              <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            <div className={`search-container ${searchVisible ? 'visible' : ''}`}>
              <form className="search-form">
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Search vehicles, parts, services..." 
                  aria-label="Search"
                />
              </form>
            </div>
          </div>

          <div className="nav-account">
            <Link to="/account" className="account-button" aria-label="Account">
              <svg className="account-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </Link>
          </div>

          <div className="nav-cart">
            <Link to="/cart" className="cart-button" aria-label="Shopping cart">
              <svg className="cart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}

    </nav>
  );
}

export default AppleNavbar;