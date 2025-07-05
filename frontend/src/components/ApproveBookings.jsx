// src/components/ApproveBookings.jsx
import React, { useState, useEffect } from 'react';
import ReservationService from '../services/ReservationService';

const ApproveBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [filter, setFilter] = useState('pending'); // Filter for view

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await ReservationService.getAllReservations();
      setBookings(response.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await ReservationService.updateReservation(bookingId, { status: newStatus });

      // Update local UI
      setBookings(prev =>
        prev.map(booking =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );

      setSuccessMessage(`Booking #${bookingId} updated to ${newStatus}.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Status update failed:', err);
      setError(`Failed to update booking #${bookingId}.`);
      setTimeout(() => setError(null), 3000);
    }
  };

  const filteredBookings = filter === 'all'
    ? bookings
    : bookings.filter(b => b.status === filter);

  if (loading) return <div className="section-loading">Loading bookings...</div>;

  return (
    <section className="approve-bookings section">
      <div className="section-header">
        <h2>Manage Bookings</h2>
        <div className="filter-controls">
          {['all', 'pending'].map(f => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {successMessage && <div className="success-message">{successMessage}</div>}
      {error && <div className="error-message">{error}</div>}

      {filteredBookings.length === 0 ? (
        <p>No {filter} bookings found.</p>
      ) : (
        <div className="bookings-table-container">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Description</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map(booking => (
                <tr key={booking.id} className={`status-${booking.status}`}>
                  <td>{booking.id}</td>
                  <td>{booking.user_name || `User-${booking.user_id}`}</td>
                  <td>{booking.description}</td>
                  <td>{new Date(booking.start_date).toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${booking.status}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="booking-actions">
                    {booking.status === 'pending' && (
                      <>
                        <button
                          className="approve-btn"
                          onClick={() => handleStatusChange(booking.id, 'confirmed')}
                        >
                          Approve
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => handleStatusChange(booking.id, 'canceled')}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {booking.status === 'approved' && (
                      <button
                        className="complete-btn"
                        onClick={() => handleStatusChange(booking.id, 'completed')}
                      >
                        Mark Complete
                      </button>
                    )}
                    {booking.status === 'rejected' && (
                      <button
                        className="reconsider-btn"
                        onClick={() => handleStatusChange(booking.id, 'pending')}
                      >
                        Reconsider
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default ApproveBookings;
