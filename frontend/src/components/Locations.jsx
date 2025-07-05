// src/components/Locations.jsx
import React, { useState, useEffect } from 'react';
import LocationService from '../services/LocationService';

const Locations = ({ setActiveSection, setTestDriveForm, testDriveForm }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch locations when component mounts
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await LocationService.getAllLocations();
        const locs = response.data.map(loc => ({

          id: loc.id,
          name: loc.name,
          address: loc.address,
          phone: loc.phone,
          hours: loc.hours || '9AM-6PM'
        }));
        setLocations(locs);
      } catch (err) {
        console.error('Error fetching locations:', err);
        setError('Error loading locations.');
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  if (loading) {
    return <div className="section-loading">Loading locations...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <section className="locations section">
      <h2>Find a Dealer Near You</h2>
      <div className="locations-grid">
        {locations.length > 0 ? (
          locations.map(location => (
            <div className="location-card" key={location.id}>
              <h3><strong>LOCATION-ID:</strong>{location.id}</h3>
              <h3>{location.name}</h3>
              <p>{location.address}</p>
              <p><strong>Phone:</strong> {location.phone}</p>
              <p><strong>Hours:</strong> {location.hours}</p>
              <div className="location-actions">
                <button className="details-btn">View Details</button>
                <button
                  className="test-drive-btn"
                  onClick={() => {
                    // Switch to test drive booking and pre-select this location
                    setActiveSection('testdrive');
                    setTestDriveForm(prev => ({
                      ...prev,
                      location: location.id.toString()
                    }));
                  }}
                >
                  Book Test Drive
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No locations available. Please check back later.</p>
        )}
      </div>
    </section>
  );
};

export default Locations;