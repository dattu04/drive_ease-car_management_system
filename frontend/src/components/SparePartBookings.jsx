// src/components/SparePartBookings.jsx
import React, { useState, useEffect } from 'react';
import SparePartBookingService from '../services/sparePartBookingService';
import SparePartsService from '../services/SparePartsService';

const SparePartBookings = ({ user }) => {
  const [sparePartBookings, setSparePartBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [spareParts, setSpareParts] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [sparePartsLoading, setSparePartsLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  // Form state
  const [newBooking, setNewBooking] = useState({
    spare_part_id: '',
    quantity: 1,
  });
  const [bookingMessage, setBookingMessage] = useState('');

  const fetchBookings = async () => {
    try {
      // Use try-catch for error handling
      let response;
      try {
        // First try to use the getMyBookings method
        response = await SparePartBookingService.getMyBookings();
      } catch (methodError) {
        console.log('getMyBookings method not available, falling back to getAllBookings');
        // If that fails, fall back to getAllBookings and filter by user ID
        response = await SparePartBookingService.getAllBookings();
        response.data = response.data.filter(booking => booking.user_id === user.id);
      }
      
      setSparePartBookings(response.data);
    } catch (err) {
      console.error('Error fetching spare part bookings:', err);
      setError('Failed to load your spare part bookings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSpareParts = async () => {
    setSparePartsLoading(true);
    try {
      const response = await SparePartsService.getAllSpareParts();
      setSpareParts(response.data);
    } catch (err) {
      console.error('Error fetching available spare parts:', err);
      setError('Failed to load available parts. Please try again later.');
    } finally {
      setSparePartsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  useEffect(() => {
    if (showBookingForm) {
      fetchAvailableSpareParts();
    }
  }, [showBookingForm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBooking({ 
      ...newBooking, 
      [name]: name === 'quantity' ? parseInt(value) : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBookingMessage('');
    setSubmitLoading(true);
    
    if (!newBooking.spare_part_id || !newBooking.quantity || newBooking.quantity < 1) {
      setBookingMessage('Please fill all required fields with valid values');
      setSubmitLoading(false);
      return;
    }

    try {
      const bookingData = {
        user_id: user.id,
        spare_part_id: parseInt(newBooking.spare_part_id),
        quantity: newBooking.quantity
      };

      console.log('Submitting spare part booking:', bookingData);
      
      const response = await SparePartBookingService.bookSparePart(bookingData);
      console.log('Spare part booking created:', response);
      
      setBookingMessage('Spare part booked successfully!');
      setNewBooking({
        spare_part_id: '',
        quantity: 1,
      });
      fetchBookings(); // Refresh spare part bookings list
      setShowBookingForm(false);
    } catch (err) {
      console.error('Error booking spare part:', err);
      setBookingMessage(`Failed to book spare part: ${err.response?.data?.message || err.message || 'Unknown error'}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return <p>Loading your spare part bookings...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <section className="spare-part-bookings section">
      <h2>My Spare Part Orders</h2>
      
      <button 
        className="booking-button" 
        onClick={() => setShowBookingForm(!showBookingForm)}
      >
        {showBookingForm ? 'Cancel' : 'Order Spare Parts'}
      </button>

      {showBookingForm && (
        <div className="booking-form-container">
          <h3>New Spare Part Order</h3>
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-group">
              <label htmlFor="spare_part_id">Select a Spare Part:</label>
              {sparePartsLoading ? (
                <p>Loading available spare parts...</p>
              ) : spareParts.length === 0 ? (
                <p>No spare parts available</p>
              ) : (
                <select 
                  id="spare_part_id" 
                  name="spare_part_id" 
                  value={newBooking.spare_part_id} 
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Select a Spare Part --</option>
                  {spareParts.map(part => (
                    <option key={part.id} value={part.id}>
                      {part.name} - {part.brand} - ${part.price}/unit
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity:</label>
              <input 
                type="number" 
                id="quantity" 
                name="quantity" 
                value={newBooking.quantity} 
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>

            {newBooking.spare_part_id && newBooking.quantity > 0 && (
              <div className="pricing-info">
                <p>
                  <strong>Price Summary:</strong>
                </p>
                <p>
                  Unit Price: ${spareParts.find(part => part.id === parseInt(newBooking.spare_part_id))?.price || 0}
                </p>
                <p>
                  <strong>Total Price: ${((spareParts.find(part => part.id === parseInt(newBooking.spare_part_id))?.price || 0) * newBooking.quantity).toFixed(2)}</strong>
                </p>
              </div>
            )}

            <button 
              type="submit" 
              className="submit-button"
              disabled={submitLoading || sparePartsLoading || spareParts.length === 0}
            >
              {submitLoading ? 'Processing...' : 'Order Part'}
            </button>
            
            {bookingMessage && (
              <p className={bookingMessage.includes('Failed') ? 'error-message' : 'success-message'}>
                {bookingMessage}
              </p>
            )}
          </form>
        </div>
      )}

      <h3>Existing Spare Part Orders</h3>
      {sparePartBookings.length === 0 ? (
        <p>You haven't ordered any spare parts yet.</p>
      ) : (
        <ul className="bookings-list">
          {sparePartBookings.map(booking => (
            <li key={booking.id} className="booking-item">
              <p>
                <strong>Order ID:</strong> {booking.id}
              </p>
              <p>
                <strong>Part:</strong> {booking.part_name || 'Unknown Part'} {booking.brand ? `(${booking.brand})` : ''}
              </p>
              <p>
                <strong>Quantity:</strong> {booking.quantity}
              </p>
              <p>
                <strong>Unit Price:</strong> ${booking.price || 0}
              </p>
              <p>
                <strong>Total Price:</strong> ${((booking.price || 0) * booking.quantity).toFixed(2)}
              </p>
              <p>
                <strong>Status:</strong> {booking.status || 'Pending'}
              </p>
              <p>
                <strong>Ordered on:</strong> {booking.booking_date ? formatDate(booking.booking_date) : 'Unknown date'}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default SparePartBookings;