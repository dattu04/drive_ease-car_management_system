// src/components/ManageLocations.jsx
import React, { useState, useEffect } from 'react';
import LocationService from '../services/LocationService';

const ManageLocations = () => {
  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    hours: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchLocations = async () => {
    try {
      const response = await LocationService.getAllLocations();
      setLocations(response.data);
    } catch (err) {
      setError('Failed to load locations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await LocationService.addLocation(form);
      setSuccess('Location added successfully.');
      setForm({ name: '', address: '', phone: '', hours: '' });
      fetchLocations();
    } catch (err) {
      setError('Failed to add location.');
    }
  };

  return (
    <section className="manage-locations section">
      <h2>Manage Locations</h2>
      <form onSubmit={handleSubmit} className="location-form">
        <div className="form-group">
          <label htmlFor="name">Location Name</label>
          <input type="text" id="name" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input type="text" id="address" name="address" value={form.address} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input type="text" id="phone" name="phone" value={form.phone} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="hours">Operating Hours</label>
          <input type="text" id="hours" name="hours" value={form.hours} onChange={handleChange} placeholder="e.g., 9AM-6PM" required />
        </div>
        <button type="submit" className="submit-btn">Add Location</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <h3>Existing Locations</h3>
      {loading ? (
        <p>Loading locations...</p>
      ) : (
        <ul className="locations-list">
          {locations.map(loc => (
            <li key={loc.id}>
              <strong>{loc.name}</strong>: {loc.address} | {loc.phone} | {loc.hours}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default ManageLocations;
