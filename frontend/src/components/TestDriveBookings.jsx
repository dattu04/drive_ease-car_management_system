import React, { useState, useEffect } from 'react';
import TestDriveService from '../services/TestDriveService';
import CarService from '../services/CarService';
import LocationService from '../services/LocationService';

const TestDriveBooking = ({ user, selectedCar }) => {
  const [testDrives, setTestDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cars, setCars] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [carsLoading, setCarsLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [newTestDrive, setNewTestDrive] = useState({
    car_id: '',
    test_drive_date: '',
    test_drive_time: '',
    location_id: '',
    notes: ''
  });
  const [bookingMessage, setBookingMessage] = useState('');

  const timeSlots = [
    '09:00:00', '10:00:00', '11:00:00', '12:00:00',
    '14:00:00', '15:00:00', '16:00:00', '17:00:00'
  ];

  const fetchTestDrives = async () => {
    try {
      const response = await TestDriveService.getUserTestDrives(user.id);
      const carResponse = await CarService.getAllCars();
      const allCars = carResponse.data;
      const locationResponse = await LocationService.getAllLocations();
      const allLocations = locationResponse.data;

      const enrichedTestDrives = response.data.map(testDrive => {
        const car = allCars.find(c => c.id === testDrive.car_id);
        const location = allLocations.find(l => l.id === testDrive.location_id);
        return {
          ...testDrive,
          car_details: car ? `${car.brand} ${car.model}` : 'Unknown Car',
          location_name: location ? location.name : 'Unknown Location'
        };
      });

      setTestDrives(enrichedTestDrives);
      setCars(allCars);
      setLocations(allLocations);
    } catch (err) {
      console.error('Error fetching test drives:', err);
      setError(`Failed to load test drives: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableCars = async () => {
    setCarsLoading(true);
    try {
      const response = await CarService.getAllCars();
      setCars(response.data);

      const locationResponse = await LocationService.getAllLocations();
      setLocations(locationResponse.data);
    } catch (err) {
      console.error('Error fetching available cars or locations:', err);
      setError(`Failed to load cars/locations: ${err.response?.data?.message || err.message}`);
    } finally {
      setCarsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTestDrives();
    }
  }, [user]);

  useEffect(() => {
    if (showBookingForm) {
      fetchAvailableCars();
    }
  }, [showBookingForm]);

  useEffect(() => {
    if (selectedCar) {
      setNewTestDrive(prev => ({
        ...prev,
        car_id: selectedCar.id.toString()
      }));
      setShowBookingForm(true);
    }
  }, [selectedCar]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTestDrive(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBookingMessage('');
    setSubmitLoading(true);

    try {
      const testDriveData = {
        user_id: user.id,
        car_id: parseInt(newTestDrive.car_id),
        test_drive_date: newTestDrive.test_drive_date,
        test_drive_time: newTestDrive.test_drive_time,
        location_id: parseInt(newTestDrive.location_id),
        notes: newTestDrive.notes || ''
      };

      await TestDriveService.createTestDrive(testDriveData);
      setBookingMessage('Test drive booked successfully!');
      setNewTestDrive({
        car_id: '',
        test_drive_date: '',
        test_drive_time: '',
        location_id: '',
        notes: ''
      });
      setShowBookingForm(false);
      fetchTestDrives();
    } catch (err) {
      console.error('Error booking test drive:', err);
      setBookingMessage(err.response?.data?.message || 'Failed to book test drive. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return <div className="section-loading">Loading test drives...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <section className="section">
      <div className="section-header">
        <h2>Test Drive Bookings</h2>
        <button
          className="booking-button"
          onClick={() => setShowBookingForm(!showBookingForm)}
        >
          {showBookingForm ? 'Cancel' : 'Book Test Drive'}
        </button>
      </div>

      {bookingMessage && (
        <div className={bookingMessage.includes('success') ? 'success-message' : 'error-message'}>
          {bookingMessage}
        </div>
      )}

      {showBookingForm && (
        <div className="booking-form-container">
          <h3>New Test Drive Booking</h3>
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-group">
              <label htmlFor="car_id">Select a Car: *</label>
              <select
                id="car_id"
                name="car_id"
                value={newTestDrive.car_id}
                onChange={handleInputChange}
                required
                disabled={carsLoading}
              >
                <option value="">-- Select a Car --</option>
                {cars.map(car => (
                  <option key={car.id} value={car.id}>
                    {car.brand} {car.model} ({car.year})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="location_id">Select Location: *</label>
              <select
                id="location_id"
                name="location_id"
                value={newTestDrive.location_id}
                onChange={handleInputChange}
                required
              >
                <option value="">-- Select a Location --</option>
                {locations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="test_drive_date">Date: *</label>
              <input
                type="date"
                id="test_drive_date"
                name="test_drive_date"
                value={newTestDrive.test_drive_date}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="test_drive_time">Time: *</label>
              <select
                id="test_drive_time"
                name="test_drive_time"
                value={newTestDrive.test_drive_time}
                onChange={handleInputChange}
                required
              >
                <option value="">-- Select Time --</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>
                    {time.substring(0, 5)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="notes">Additional Notes:</label>
              <textarea
                id="notes"
                name="notes"
                value={newTestDrive.notes}
                onChange={handleInputChange}
                placeholder="Any special requests or notes..."
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <button type="submit" className="submit-button" disabled={submitLoading}>
                {submitLoading ? 'Booking...' : 'Book Test Drive'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* History Section */}
      <div className="history-section">
        <button
          className={`history-toggle ${showHistory ? 'expanded' : ''}`}
          onClick={() => setShowHistory(!showHistory)}
        >
          <span>My Test Drive History ({testDrives.length})</span>
          <span className="history-toggle-icon">{showHistory ? '▼' : '▶'}</span>
        </button>

        {showHistory && (
          <div className="history-content">
            {testDrives.length > 0 ? (
              testDrives.map(testDrive => (
                <div key={testDrive.id} className="history-card">
                  <div className="history-card-header">
                    <span className="history-card-id">Booking ID: {testDrive.id}</span>
                    <span className={`status-badge ${testDrive.status}`}>
                      {testDrive.status}
                    </span>
                  </div>
                  <div className="history-card-body">
                    <div className="history-detail">
                      <span className="history-label">Car:</span>
                      <span className="history-value">{testDrive.car_details}</span>
                    </div>
                    <div className="history-detail">
                      <span className="history-label">Date:</span>
                      <span className="history-value">
                        {new Date(testDrive.test_drive_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="history-detail">
                      <span className="history-label">Time:</span>
                      <span className="history-value">
                        {testDrive.test_drive_time?.substring(0, 5)}
                      </span>
                    </div>
                    <div className="history-detail">
                      <span className="history-label">Location:</span>
                      <span className="history-value">{testDrive.location_name}</span>
                    </div>
                    {testDrive.notes && (
                      <div className="history-detail" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span className="history-label">Notes:</span>
                        <span className="history-value">{testDrive.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>You haven't booked any test drives yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestDriveBooking;