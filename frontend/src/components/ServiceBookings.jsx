// src/components/ServiceBooking.jsx
import React, { useState, useEffect } from 'react';
import LocationService from '../services/LocationService';
import ServiceRequestService from '../services/ServiceRequestService';
import CarService from '../services/CarService';

const ServiceBooking = ({ user }) => {
  const [locations, setLocations] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({
    serviceType: '',
    location_id: '',
    service_date: '',
    time: '',
    car_id: '',
    description: '',
    cost: '0'
  });
  const [loading, setLoading] = useState(true);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingError, setBookingError] = useState(null);

  const fetchLocations = async () => {
    try {
      const response = await LocationService.getAllLocations();
      setLocations(response.data);
    } catch (err) {
      console.error('Error fetching locations:', err);
    } finally {
      setLoading(false);
    }
  };

// Modified fetchCars function in ServiceBooking.jsx
const fetchCars = async () => {
  setVehiclesLoading(true);
  try {
    const response = await CarService.getAllCars();
    console.log('Raw car data:', response.data); // Debug log to see the actual response
    
    // Check if we're getting any cars at all before filtering
    if (response.data && response.data.length > 0) {
      // Adjust this filter based on how availability is actually represented in your API
      const availableCars = response.data.filter(car => {
        // Log the availability value to debug
        console.log(`Car ${car.id} availability:`, car.availability);
        
        // Check different possible representations of availability
        return car.availability === true || 
               car.availability === 'true' || 
               car.availability === 'available' ||
               car.availability === 1;
      });
      
      console.log('Available cars after filter:', availableCars);
      
      const cars = availableCars.map(car => ({
        id: car.id,
        make: car.brand || car.make, // Handle both possible field names
        model: car.model,
        year: car.year
      }));
      
      console.log('Processed cars for dropdown:', cars);
      setVehicles(cars);
    } else {
      console.warn('No cars received from API');
      setVehicles([]);
    }
  } catch (err) {
    console.error('Error fetching cars:', err);
    setVehicles([]);
  } finally {
    setVehiclesLoading(false);
  }
};
  useEffect(() => {
    fetchLocations();
    fetchCars();
  }, [user]);

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value });
    
    // Update estimated cost based on service type
    if (e.target.name === 'serviceType') {
      const costs = {
        'Oil Change': '49.99',
        'Tire Rotation': '29.99',
        'Brake Inspection': '39.99',
        'General Maintenance': '89.99'
      };
      setForm(prev => ({...prev, cost: costs[e.target.value] || '0'}));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBookingSubmitting(true);
    setBookingError(null);
    setBookingSuccess(null);

    try {
      // Combine date and time for the service_date field
      const combinedDateTime = `${form.service_date}T${form.time}:00`;
      
      // Create the service record - match exactly what backend expects
      const serviceData = {
        car_id: parseInt(form.car_id),
        location_id: parseInt(form.location_id),
        service_date: combinedDateTime,
        description: `${form.serviceType}: ${form.description}`,
        cost: parseFloat(form.cost)
        // No need to send user_id or status as the backend extracts user_id from token
        // and sets status to "pending" by default
      };
      
      // Log the data being sent for debugging
      console.log('Sending service data:', serviceData);
      
      const response = await ServiceRequestService.addService(serviceData);
      console.log('Service booked:', response.data);
      
      setBookingSuccess('Service booked successfully! We will contact you to confirm.');
      setForm({
        serviceType: '',
        location_id: '',
        service_date: '',
        time: '',
        car_id: '',
        description: '',
        cost: '0'
      });
    } catch (err) {
      console.error('Service booking error:', err);
      console.error('Error details:', err.response ? err.response.data : 'No response data');
      setBookingError(`Failed to book service: ${err.response?.data?.message || 'Please try again.'}`);
    } finally {
      setBookingSubmitting(false);
    }
  };

  if (loading || vehiclesLoading) {
    return <p>Loading...</p>;
  }

  // Format today's date for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <section className="service-booking section">
      <h2>Book a Service</h2>
      {bookingSuccess && <p className="success-message">{bookingSuccess}</p>}
      {bookingError && <p className="error-message">{bookingError}</p>}
      
      <form onSubmit={handleSubmit} className="service-booking-form">
        <div className="form-group">
          <label htmlFor="serviceType">Service Type</label>
          <select id="serviceType" name="serviceType" value={form.serviceType} onChange={handleChange} required>
            <option value="">-- Select Service --</option>
            <option value="Oil Change">Oil Change</option>
            <option value="Tire Rotation">Tire Rotation</option>
            <option value="Brake Inspection">Brake Inspection</option>
            <option value="General Maintenance">General Maintenance</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="location_id">Service Location</label>
          <select 
            id="location_id" 
            name="location_id" 
            value={form.location_id} 
            onChange={handleChange} 
            required
          >
            <option value="">-- Select Location --</option>
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>
                {loc.name} - {loc.address}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="car_id">Vehicle</label>
          <select 
            id="car_id" 
            name="car_id" 
            value={form.car_id} 
            onChange={handleChange}
            required
          >
            <option value="">-- Select Vehicle --</option>
            {vehicles.map(vehicle => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.make} {vehicle.model} ({vehicle.year})
              </option>
            ))}
          </select>
          {vehicles.length === 0 && (
            <p className="info-text">No available vehicles found. Please check the car inventory.</p>
          )}
        </div>
        
        <div className="form-row" style={{ display: 'flex', gap: '16px' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="service_date">Service Date</label>
            <input 
              type="date" 
              id="service_date" 
              name="service_date" 
              value={form.service_date} 
              onChange={handleChange} 
              required 
              min={today}
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="time">Service Time</label>
            <input 
              type="time" 
              id="time" 
              name="time" 
              value={form.time} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="cost">Estimated Cost ($)</label>
          <input 
            type="text" 
            id="cost" 
            name="cost" 
            value={form.cost} 
            onChange={handleChange}
            required
          />
          <p className="info-text">This is an estimated cost. Final price may vary based on inspection.</p>
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Additional Comments</label>
          <textarea 
            id="description" 
            name="description" 
            value={form.description} 
            onChange={handleChange} 
            rows={4} 
            placeholder="Any specific issues or requirements?"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-btn" 
          disabled={bookingSubmitting || vehicles.length === 0}
        >
          {bookingSubmitting ? 'Booking...' : 'Book Service'}
        </button>
      </form>
    </section>
  );
};

export default ServiceBooking;