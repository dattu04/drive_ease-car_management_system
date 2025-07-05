// src/components/CarBookings.jsx
import React, { useState, useEffect } from 'react';
import ReservationService from '../services/ReservationService';
import CarService from '../services/CarService';

const CarBookings = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cars, setCars] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [carsLoading, setCarsLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [newBooking, setNewBooking] = useState({
    car_id: '',
    start_date: '',
    end_date: '',
  });
  const [bookingMessage, setBookingMessage] = useState('');

  const fetchBookings = async () => {
    try {
      const response = await ReservationService.getAllReservations();
      const carResponse = await CarService.getAllCars();
      const allCars = carResponse.data;

      const userBookings = response.data
        .filter(booking => booking.user_id === user.id)
        .map(booking => {
          const car = allCars.find(c => c.id === booking.car_id);
          return {
            ...booking,
            car_name: car ? `${car.model}` : null
          };
        });

      setBookings(userBookings);
      setCars(allCars);
    } catch (err) {
      console.error('Error fetching bookings or cars:', err);
      setError('Failed to load your bookings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableCars = async () => {
    setCarsLoading(true);
    try {
      const response = await CarService.getAllCars();
      setCars(response.data);
    } catch (err) {
      console.error('Error fetching available cars:', err);
    } finally {
      setCarsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
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
    const rentalCost = days * carPrice;
    const bookingFee = 100;
    return parseFloat((rentalCost + bookingFee).toFixed(2));
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
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) return <p>Loading your bookings...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <section className="car-bookings section" style={{ minHeight: '100%', width: '100%' }}>
      <div style={{ maxWidth: '100%', overflow: 'auto' }}>
        <h2>My Car Bookings</h2>

        <button
          className="booking-button"
          onClick={() => setShowBookingForm(!showBookingForm)}
        >
          {showBookingForm ? 'Cancel' : 'Book a Car'}
        </button>

        {showBookingForm && (
          <div className="booking-form-container">
            <h3>New Car Reservation</h3>
            <form onSubmit={handleSubmit} className="booking-form">
              {/* Car Select */}
              <div className="form-group">
                <label htmlFor="car_id">Select a Car:</label>
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

              {/* Start Date */}
              <div className="form-group">
                <label htmlFor="start_date">Start Date:</label>
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

              {/* End Date */}
              <div className="form-group">
                <label htmlFor="end_date">End Date (2 days after start date):</label>
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

              {/* Price Info */}
              {newBooking.car_id && newBooking.start_date && newBooking.end_date && (
                <div className="pricing-info">
                  <p><strong>Price Breakdown:</strong></p>
                  <p>
                    Car Rental: ₹{calculateTotalPrice(
                      newBooking.start_date,
                      newBooking.end_date,
                      cars.find(car => car.id === parseInt(newBooking.car_id))?.price_per_day || 0
                    ) - 100}
                  </p>
                  <p>Booking Fee: ₹100</p>
                  <p>
                    <strong>Total: ₹{calculateTotalPrice(
                      newBooking.start_date,
                      newBooking.end_date,
                      cars.find(car => car.id === parseInt(newBooking.car_id))?.price_per_day || 0
                    )}</strong>
                  </p>
                </div>
              )}

              <button type="submit" className="submit-button" disabled={submitLoading}>
                {submitLoading ? 'Submitting...' : 'Submit Reservation'}
              </button>

              {bookingMessage && (
                <p className={bookingMessage.includes('Failed') ? 'error-message' : 'success-message'}>
                  {bookingMessage}
                </p>
              )}
            </form>
          </div>
        )}

        <h3>Existing Car Bookings</h3>
        {bookings.length === 0 ? (
          <p>You haven't made any car bookings yet.</p>
        ) : (
          <ul className="bookings-list">
            {bookings.map(booking => (
              <li key={booking.id} className="booking-item">
                <p><strong>ID:</strong> {booking.id}</p>
                <p><strong>Car:</strong> {booking.car_name || `Car ID ${booking.car_id}`}</p>
                <p><strong>Status:</strong> {booking.status}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default CarBookings;
