// src/components/CarBookings.jsx
import React, { useState, useEffect } from 'react';
import ReservationService from '../services/ReservationService';
import CarService from '../services/CarService';

const CarBookings = ({ user }) => {
  console.log('CarBookings component mounted, user:', user);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cars, setCars] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [carsLoading, setCarsLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [newBooking, setNewBooking] = useState({
    car_id: '',
    start_date: '',
    end_date: '',
  });
  const [bookingMessage, setBookingMessage] = useState('');

  const fetchBookings = async () => {
    if (!user || !user.id) {
      console.error('User or user ID is not available');
      setError('User information is not available. Please try refreshing the page.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await ReservationService.getAllReservations();
      const carResponse = await CarService.getAllCars();

      if (!response || !response.data || !carResponse || !carResponse.data) {
        throw new Error('Failed to fetch bookings or cars data');
      }

      const allCars = carResponse.data || [];
      const carsMap = {};
      allCars.forEach(car => {
        if (car && car.id) {
          carsMap[car.id] = car;
        }
      });

      const userBookings = (response.data || [])
        .filter(booking => booking && booking.user_id === user.id)
        .map(booking => {
          const car = carsMap[booking.car_id];
          const pricePerDay = parseFloat(car?.price_per_day) || 0;
          const totalPrice = parseFloat(booking.total_price) || 0;

          return {
            ...booking,
            car_name: car ? `${car.make} ${car.model}` : `Car ID ${booking.car_id}`,
            car_make: car?.make || 'Unknown',
            car_model: car?.model || 'Unknown',
            price_per_day: pricePerDay,
            total_price: totalPrice
          };
        });

      setBookings(userBookings);
      setCars(allCars);
    } catch (err) {
      console.error('Error fetching bookings or cars:', err);
      setError(err.message || 'Failed to load your bookings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableCars = async () => {
    setCarsLoading(true);
    try {
      const response = await CarService.getAllCars();
      setCars(response.data || []);
    } catch (err) {
      console.error('Error fetching available cars:', err);
      setCars([]);
      setBookingMessage('Failed to load available cars. Please try again later.');
    } finally {
      setCarsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (showBookingForm) {
      fetchAvailableCars();
    }
  }, [showBookingForm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBooking({ ...newBooking, [name]: value });

    if (name === 'start_date' && value) {
      const startDate = new Date(value);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 2);
      const formattedEndDate = endDate.toISOString().split('T')[0];
      setNewBooking(prev => ({ ...prev, end_date: formattedEndDate }));
    }
  };

  const calculateTotalPrice = (start, end, carPrice) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const rentalCost = days * parseFloat(carPrice || 0);
    const bookingFee = 100;
    return parseFloat((rentalCost + bookingFee).toFixed(2));
  };

  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBookingMessage('');
    setSubmitLoading(true);

    if (!newBooking.car_id || !newBooking.start_date || !newBooking.end_date) {
      setBookingMessage('Please fill all required fields');
      setSubmitLoading(false);
      return;
    }

    const startDate = new Date(newBooking.start_date);
    const endDate = new Date(newBooking.end_date);
    const expectedEndDate = new Date(startDate);
    expectedEndDate.setDate(startDate.getDate() + 2);

    if (endDate.getTime() !== expectedEndDate.getTime()) {
      setBookingMessage('End date must be exactly two days after start date');
      setSubmitLoading(false);
      return;
    }

    const selectedCar = cars.find(car => car.id === parseInt(newBooking.car_id));
    if (!selectedCar) {
      setBookingMessage('Invalid car selection');
      setSubmitLoading(false);
      return;
    }

    try {
      const totalPrice = calculateTotalPrice(
        newBooking.start_date,
        newBooking.end_date,
        selectedCar.price_per_day || 50
      );

      const reservationData = {
        user_id: user.id,
        car_id: parseInt(newBooking.car_id),
        start_date: newBooking.start_date,
        end_date: newBooking.end_date,
        total_price: totalPrice,
        status: 'pending'
      };

      await ReservationService.addReservation(reservationData);
      setBookingMessage('Booking request submitted successfully!');
      setNewBooking({ car_id: '', start_date: '', end_date: '' });
      fetchBookings();
      setShowBookingForm(false);
    } catch (err) {
      console.error('Error creating booking:', err);
      setBookingMessage(`Failed to create booking: ${err.response?.data?.message || err.message || 'Unknown error'}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return <div className="section-loading">Loading your car bookings...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Additional safety check for user prop
  if (!user || !user.id) {
    return (
      <div className="error-message">
        User information is not available. Please try refreshing the page or logging in again.
      </div>
    );
  }

  return (
    <section className="section">
      <div className="section-header">
        <h2>My Car Bookings</h2>
        <button
          className="booking-button"
          onClick={() => setShowBookingForm(!showBookingForm)}
        >
          {showBookingForm ? 'Cancel' : 'Book a Car'}
        </button>
      </div>

      {bookingMessage && (
        <div className={bookingMessage.includes('success') ? 'success-message' : 'error-message'}>
          {bookingMessage}
        </div>
      )}

      {showBookingForm && (
        <div className="booking-form-container">
          <h3>New Car Reservation</h3>
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-group">
              <label htmlFor="car_id">Select a Car: *</label>
              {carsLoading ? (
                <p>Loading available cars...</p>
              ) : (
                <select
                  id="car_id"
                  name="car_id"
                  value={newBooking.car_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Select a Car --</option>
                  {cars.map(car => (
                    <option key={car.id} value={car.id}>
                      {car.make} {car.model} - ₹{car.price_per_day}/day
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="start_date">Start Date: *</label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={newBooking.start_date}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="end_date">End Date (2 days after start date): *</label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={newBooking.end_date}
                onChange={handleInputChange}
                readOnly
                required
              />
              <small>End date is automatically set to 2 days after start date</small>
            </div>

            {newBooking.car_id && newBooking.start_date && newBooking.end_date && (
              <div className="pricing-info">
                <p><strong>Price Breakdown:</strong></p>
                <p>
                  Car Rental (2 days): ₹{(calculateTotalPrice(
                    newBooking.start_date,
                    newBooking.end_date,
                    cars.find(car => car.id === parseInt(newBooking.car_id))?.price_per_day || 0
                  ) - 100).toFixed(2)}
                </p>
                <p>Booking Fee: ₹100.00</p>
                <p>
                  <strong>Total: ₹{calculateTotalPrice(
                    newBooking.start_date,
                    newBooking.end_date,
                    cars.find(car => car.id === parseInt(newBooking.car_id))?.price_per_day || 0
                  ).toFixed(2)}</strong>
                </p>
              </div>
            )}

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <button type="submit" className="submit-button" disabled={submitLoading}>
                {submitLoading ? 'Submitting...' : 'Submit Reservation'}
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
          <span>Existing Car Bookings ({bookings.length})</span>
          <span className="history-toggle-icon">{showHistory ? '▼' : '▶'}</span>
        </button>

        {showHistory && (
          <div className="history-content">
            {bookings.length > 0 ? (
              bookings.map(booking => (
                <div key={booking.id} className="history-card">
                  <div className="history-card-header">
                    <span className="history-card-id">Booking ID: {booking.id}</span>
                    <span className={`status-badge ${booking.status || 'pending'}`}>
                      {booking.status || 'pending'}
                    </span>
                  </div>
                  <div className="history-card-body">
                    <div className="history-detail">
                      <span className="history-label">Car:</span>
                      <span className="history-value">
                        {booking.car_name}
                      </span>
                    </div>
                    <div className="history-detail">
                      <span className="history-label">Start Date:</span>
                      <span className="history-value">{formatDate(booking.start_date)}</span>
                    </div>
                    <div className="history-detail">
                      <span className="history-label">End Date:</span>
                      <span className="history-value">{formatDate(booking.end_date)}</span>
                    </div>
                    <div className="history-detail">
                      <span className="history-label">Duration:</span>
                      <span className="history-value">
                        {calculateDays(booking.start_date, booking.end_date)} days
                      </span>
                    </div>
                    <div className="history-detail">
                      <span className="history-label">Total Price:</span>
                      <span className="history-value price">
                        ₹{typeof booking.total_price === 'number'
                          ? booking.total_price.toFixed(2)
                          : parseFloat(booking.total_price || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="history-detail">
                      <span className="history-label">Booked on:</span>
                      <span className="history-value">
                        {booking.reservation_date ? formatDate(booking.reservation_date) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>You haven't made any car bookings yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default CarBookings;
