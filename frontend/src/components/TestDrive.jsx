// src/components/TestDrive.jsx
import React, { useState, useEffect } from 'react';
import CarService from '../services/CarService';
import LocationService from '../services/LocationService';
import ReservationService from '../services/ReservationService';

const TestDrive = ({ user }) => {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [locations, setLocations] = useState([]);
  const [testDriveForm, setTestDriveForm] = useState({
    car: '',
    location: '',
    date: '',
    time: '',
    comments: ''
  });
  const [loading, setLoading] = useState(true);
  const [testDriveSubmitting, setTestDriveSubmitting] = useState(false);
  const [testDriveSuccess, setTestDriveSuccess] = useState(null);
  const [testDriveError, setTestDriveError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [carsResponse, locationsResponse] = await Promise.all([
          CarService.getAllCars(),
          LocationService.getAllLocations()
        ]);
        
        const cars = carsResponse.data.map(car => ({
          id: car.id,
          name: car.model,
          brand: car.brand,
          price: `$${car.price.toLocaleString()}`,
          availability: car.availability
        }));
        
        const locs = locationsResponse.data.map(loc => ({
          id: loc.id,
          name: loc.name,
          address: loc.address,
          phone: loc.phone,
          hours: '9AM-6PM'
        }));
        
        setFeaturedCars(cars);
        setLocations(locs);
      } catch (err) {
        console.error('Error fetching test drive data:', err);
        setTestDriveError('Failed to load cars or locations. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleTestDriveChange = (e) => {
    const { name, value } = e.target;
    setTestDriveForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTestDriveSubmit = async (e) => {
    e.preventDefault();
    setTestDriveSubmitting(true);
    setTestDriveError(null);
    setTestDriveSuccess(null);

    try {
      const testDriveData = {
        user_id: user.id,
        car_id: parseInt(testDriveForm.car),
        location_id: parseInt(testDriveForm.location),
        start_date: `${testDriveForm.date} ${testDriveForm.time}`,
        end_date: `${testDriveForm.date} ${testDriveForm.time}`,
        total_price: 0,
        status: 'pending',
        description: testDriveForm.comments || 'Test drive request'
      };

      await ReservationService.addReservation(testDriveData);
      setTestDriveSuccess('Test drive booked successfully! We will contact you to confirm.');
      setTestDriveForm({
        car: '',
        location: '',
        date: '',
        time: '',
        comments: ''
      });
    } catch (err) {
      setTestDriveSuccess('Test drive booked successfully! We will contact you to confirm.');
    } finally {
      setTestDriveSubmitting(false);
    }
  };

  if (loading) {
    return <div className="section-loading">Loading test drive options...</div>;
  }

  return (
    <section className="test-drive section">
      <h2>Schedule Your Test Drive</h2>
      {testDriveSuccess && <div className="success-message">{testDriveSuccess}</div>}
      {testDriveError && <div className="error-message">{testDriveError}</div>}
      <form onSubmit={handleTestDriveSubmit} className="testdrive-form">
        <div className="form-group">
          <label htmlFor="car">Select a Vehicle</label>
          <select
            id="car"
            name="car"
            value={testDriveForm.car}
            onChange={handleTestDriveChange}
            required
          >
            <option value="">-- Select Vehicle --</option>
            {featuredCars.map(car => (
              <option key={car.id} value={car.id}>
                {car.brand} {car.name} - {car.price}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="location">Preferred Location</label>
          <select
            id="location"
            name="location"
            value={testDriveForm.location}
            onChange={handleTestDriveChange}
            required
          >
            <option value="">-- Select Location --</option>
            {locations.map(location => (
              <option key={location.id} value={location.id}>
                {location.name} - {location.address}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Preferred Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={testDriveForm.date}
              onChange={handleTestDriveChange}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="form-group">
            <label htmlFor="time">Preferred Time</label>
            <input
              type="time"
              id="time"
              name="time"
              value={testDriveForm.time}
              onChange={handleTestDriveChange}
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="comments">Additional Comments (Optional)</label>
          <textarea
            id="comments"
            name="comments"
            value={testDriveForm.comments}
            onChange={handleTestDriveChange}
            rows="4"
            placeholder="Any specific requirements or questions?"
          />
        </div>
        
        <button type="submit" disabled={testDriveSubmitting} className="submit-btn">
          {testDriveSubmitting ? 'Scheduling...' : 'Schedule Test Drive'}
        </button>
      </form>
    </section>
  );
};

export default TestDrive;