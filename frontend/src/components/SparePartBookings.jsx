// src/components/SparePartBookings.jsx
import React, { useState, useEffect } from 'react';
import SparePartBookingService from '../services/sparePartBookingService';
import SparePartsService from '../services/SparePartsService';

const SparePartBookings = ({ user }) => {
  console.log('SparePartBookings component mounted, user:', user);

  const [sparePartBookings, setSparePartBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [spareParts, setSpareParts] = useState([]);
  const [allParts, setAllParts] = useState([]); // Store all parts for lookup
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [sparePartsLoading, setSparePartsLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [newBooking, setNewBooking] = useState({
    spare_part_id: '',
    quantity: 1,
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

      // First, fetch all spare parts for lookup
      const partsResponse = await SparePartsService.getAllSpareParts();

      if (!partsResponse || !partsResponse.data) {
        throw new Error('Failed to fetch spare parts data');
      }

      const partsMap = {};
      (partsResponse.data || []).forEach(part => {
        if (part && part.id) {
          partsMap[part.id] = part;
        }
      });
      setAllParts(partsMap);

      // Then fetch bookings
      let response;
      try {
        response = await SparePartBookingService.getMyBookings();
      } catch (methodError) {
        console.log('getMyBookings not available, using getAllBookings');
        response = await SparePartBookingService.getAllBookings();
        if (response && response.data) {
          response.data = (response.data || []).filter(booking => booking && booking.user_id === user.id);
        }
      }

      if (!response || !response.data) {
        throw new Error('Failed to fetch bookings data');
      }

      // Enrich bookings with spare part details from the map
      const enrichedBookings = (response.data || []).map(booking => {
        if (!booking) return null;

        const part = partsMap[booking.spare_part_id];
        const unitPrice = parseFloat(part?.price) || 0;
        const quantity = parseInt(booking.quantity) || 0;

        return {
          ...booking,
          part_name: part?.name || `Part ID: ${booking.spare_part_id}`,
          part_brand: part?.brand || 'Unknown',
          unit_price: unitPrice,
          total_price: unitPrice * quantity
        };
      }).filter(Boolean); // Remove any null entries

      setSparePartBookings(enrichedBookings);
    } catch (err) {
      console.error('Error fetching spare part bookings:', err);
      setError(err.message || 'Failed to load your spare part bookings. Please try again later.');
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
      setSpareParts([]);
      setBookingMessage('Failed to load available parts. Please try again later.');
    } finally {
      setSparePartsLoading(false);
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

      await SparePartBookingService.createBooking(bookingData);
      setBookingMessage('Spare part ordered successfully!');
      setNewBooking({ spare_part_id: '', quantity: 1 });
      setShowBookingForm(false);
      fetchBookings();
    } catch (err) {
      console.error('Error creating spare part booking:', err);
      setBookingMessage(err.response?.data?.message || 'Failed to order spare part. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return <div className="section-loading">Loading spare part orders...</div>;
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
        <h2>Spare Part Orders</h2>
        <button
          className="booking-button"
          onClick={() => setShowBookingForm(!showBookingForm)}
        >
          {showBookingForm ? 'Cancel' : 'Order Spare Parts'}
        </button>
      </div>

      {bookingMessage && (
        <div className={bookingMessage.includes('success') ? 'success-message' : 'error-message'}>
          {bookingMessage}
        </div>
      )}

      {showBookingForm && (
        <div className="booking-form-container">
          <h3>Order Spare Parts</h3>
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-group">
              <label htmlFor="spare_part_id">Select Spare Part: *</label>
              <select
                id="spare_part_id"
                name="spare_part_id"
                value={newBooking.spare_part_id}
                onChange={handleInputChange}
                required
                disabled={sparePartsLoading}
              >
                <option value="">-- Select a Spare Part --</option>
                {spareParts.map(part => (
                  <option key={part.id} value={part.id}>
                    {part.name} ({part.brand}) - ${part.price} - Stock: {part.stock_quantity}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity: *</label>
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

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <button type="submit" className="submit-button" disabled={submitLoading}>
                {submitLoading ? 'Ordering...' : 'Place Order'}
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
          <span>Existing Spare Part Orders ({sparePartBookings.length})</span>
          <span className="history-toggle-icon">{showHistory ? '▼' : '▶'}</span>
        </button>

        {showHistory && (
          <div className="history-content">
            {sparePartBookings.length > 0 ? (
              sparePartBookings.map(booking => (
                <div key={booking.id} className="history-card">
                  <div className="history-card-header">
                    <span className="history-card-id">Order ID: {booking.id}</span>
                    <span className={`status-badge ${booking.status || 'booked'}`}>
                      {booking.status || 'booked'}
                    </span>
                  </div>
                  <div className="history-card-body">
                    <div className="history-detail">
                      <span className="history-label">Part:</span>
                      <span className="history-value">
                        {booking.part_name} ({booking.part_brand})
                      </span>
                    </div>
                    <div className="history-detail">
                      <span className="history-label">Quantity:</span>
                      <span className="history-value">{booking.quantity}</span>
                    </div>
                    <div className="history-detail">
                      <span className="history-label">Unit Price:</span>
                      <span className="history-value price">
                        ${typeof booking.unit_price === 'number' ? booking.unit_price.toFixed(2) : parseFloat(booking.unit_price || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="history-detail">
                      <span className="history-label">Total Price:</span>
                      <span className="history-value price">
                        ${typeof booking.total_price === 'number' ? booking.total_price.toFixed(2) : parseFloat(booking.total_price || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="history-detail">
                      <span className="history-label">Ordered on:</span>
                      <span className="history-value">
                        {booking.booking_date ? new Date(booking.booking_date).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>You haven't ordered any spare parts yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default SparePartBookings;