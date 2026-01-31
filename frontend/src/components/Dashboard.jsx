// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import FeaturedVehicles from './FeaturedVehicles';
import TestDriveBookings from './TestDriveBookings';
import Locations from './Locations';
import CarBookings from './CarBookings';
import SparePartBookings from './SparePartBookings';
import ManageLocations from './ManageLocations';
import ServiceBooking from './ServiceBookings';
import ApproveBookings from './ApproveBookings';
import PartsInventory from './PartsInventory';
import '../styles/Dashboard.css';


const Dashboard = () => {
  const navigate = useNavigate();

  // User and display state
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('featured');
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  // Booking tabs state
  const [activeBookingTab, setActiveBookingTab] = useState('car');

  // Location and test drive state
  const [locations, setLocations] = useState([]);
  const [TestDriveBookingsForm, setTestDriveBookingsForm] = useState({
    car: '',
    location: '',
    date: '',
    time: '',
    comments: ''
  });

  // State for selected car (for test drives and bookings)
  const [selectedCar, setSelectedCar] = useState(null);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarExpanded(prev => !prev);
  };

  // Authenticate user
  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setLoading(false);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  // Get section title based on active section
  const getSectionTitle = () => {
    const titles = {
      featured: 'Explore Our Vehicles',
      TestDriveBookings: 'Schedule a Test Drive',
      parts: 'Inventory Management',
      locations: 'Find a Dealer',
      bookings: activeBookingTab === 'car' ? 'My Car Bookings' : 'My Spare Parts Orders',
      services: 'Book a Service',
      'manage-locations': 'Manage Locations',
      'approve-bookings': 'Approve Bookings',
      'car-management': 'Manage Vehicles'
    };
    return titles[activeSection] || 'Welcome';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Function to check if section is accessible for current user role
  const canAccessSection = (section) => {
    if (!user) return false;

    // Sections accessible to all users
    if (['featured'].includes(section)) return true;

    // Customer-specific sections
    if (['TestDriveBookings', 'bookings', 'services'].includes(section)) {
      return user.role === 'customer';
    }

    // Employee & Supervisor sections
    if (['approve-bookings', 'parts', 'car-management'].includes(section)) {
      return ['employee', 'supervisor'].includes(user.role);
    }

    // Supervisor-only sections
    if (['manage-locations'].includes(section)) {
      return user.role === 'supervisor';
    }

    return false;
  };

  // Render booking tabs navigation
  const renderBookingTabs = () => {
    return (
      <div className="booking-tabs">
        <button
          className={`tab-button ${activeBookingTab === 'car' ? 'active' : ''}`}
          onClick={() => setActiveBookingTab('car')}
        >
          Car Bookings
        </button>
        <button
          className={`tab-button ${activeBookingTab === 'spareparts' ? 'active' : ''}`}
          onClick={() => setActiveBookingTab('spareparts')}
        >
          Spare Parts Orders
        </button>
      </div>
    );
  };
  return (
    <>

      <div className="dashboard-container">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          user={user}
          handleLogout={handleLogout}
          sidebarExpanded={sidebarExpanded}
          toggleSidebar={toggleSidebar}
        />
        <main className={`main-content ${sidebarExpanded ? 'expanded' : ''}`}>
          {error && <div className="error-message">{error}</div>}
          {!error && (
            <>

              {activeSection === 'featured' && (
                <FeaturedVehicles
                  setActiveSection={setActiveSection}
                  user={user}
                  setSelectedCar={setSelectedCar}
                />
              )}

              {activeSection === 'TestDriveBookings' && canAccessSection('TestDriveBookings') && (
                <TestDriveBookings user={user} selectedCar={selectedCar} />
              )}

              {activeSection === 'locations' && (
                <Locations
                  locations={locations}
                  setActiveSection={setActiveSection}
                  setTestDriveBookingsForm={setTestDriveBookingsForm}
                  TestDriveBookingsForm={TestDriveBookingsForm}
                />
              )}

              {activeSection === 'bookings' && canAccessSection('bookings') && (
                <>
                  {activeSection === 'bookings' && canAccessSection('bookings') && (
                    <>
                      {renderBookingTabs()} {/* 👈 This shows the Car/Spare Parts toggle buttons */}
                      {activeBookingTab === 'car' && <CarBookings user={user} selectedCar={selectedCar} />}
                      {activeBookingTab === 'spareparts' && <SparePartBookings user={user} />}
                    </>
                  )}

                </>
              )}


              {activeSection === 'services' && canAccessSection('services') && (
                <ServiceBooking user={user} />
              )}

              {activeSection === 'manage-locations' && canAccessSection('manage-locations') && (
                <ManageLocations />
              )}

              {activeSection === 'approve-bookings' && canAccessSection('approve-bookings') && (
                <ApproveBookings />
              )}

              {activeSection === 'parts' && canAccessSection('parts') && (
                <PartsInventory />
              )}

              {activeSection === 'car-management' && canAccessSection('car-management') && (
                <FeaturedVehicles
                  setActiveSection={setActiveSection}
                  user={user}
                  isManageMode={true}
                />
              )}


            </>
          )}
        </main>
      </div>
    </>
  );
};

export default Dashboard;