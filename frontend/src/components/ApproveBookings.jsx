// src/components/ApproveBookings.jsx
import React, { useState, useEffect } from 'react';
import ReservationService from '../services/ReservationService';
import TestDriveService from '../services/TestDriveService';

const ApproveBookings = () => {
  const [reservations, setReservations] = useState([]);
  const [testDrives, setTestDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [filter, setFilter] = useState('pending'); // Filter for view
  const [activeTab, setActiveTab] = useState('reservations'); // Tab state

  const fetchReservations = async () => {
    try {
      const response = await ReservationService.getAllReservations();
      setReservations(response.data);
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError('Failed to load reservations.');
    }
  };

  const fetchTestDrives = async () => {
    try {
      const response = await TestDriveService.getAllTestDrives();
      setTestDrives(response.data);
    } catch (err) {
      console.error('Error fetching test drives:', err);
      setError('Failed to load test drives.');
    }
  };

  const fetchAllBookings = async () => {
    setLoading(true);
    await Promise.all([fetchReservations(), fetchTestDrives()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const handleReservationStatusChange = async (bookingId, newStatus) => {
    try {
      await ReservationService.updateReservation(bookingId, { status: newStatus });
      setReservations(prev =>
        prev.map(booking =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
      setSuccessMessage(`Reservation #${bookingId} updated to ${newStatus}.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Status update failed:', err);
      setError(`Failed to update reservation #${bookingId}.`);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleTestDriveStatusChange = async (testDriveId, newStatus) => {
    try {
      await TestDriveService.updateTestDrive(testDriveId, { status: newStatus });
      setTestDrives(prev =>
        prev.map(td =>
          td.id === testDriveId ? { ...td, status: newStatus } : td
        )
      );
      setSuccessMessage(`Test Drive #${testDriveId} updated to ${newStatus}.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Status update failed:', err);
      setError(`Failed to update test drive #${testDriveId}.`);
      setTimeout(() => setError(null), 3000);
    }
  };

  const filteredReservations = filter === 'all'
    ? reservations
    : reservations.filter(b => b.status === filter);

  const filteredTestDrives = filter === 'all'
    ? testDrives
    : testDrives.filter(td => td.status === filter);

  if (loading) return <div className="section-loading">Loading bookings...</div>;

  return (
    <section className="approve-bookings section">
      <div className="section-header">
        <h2>Manage Bookings</h2>

        {/* Tab Navigation */}
        <div className="booking-tabs">
          <button
            className={`tab-button ${activeTab === 'reservations' ? 'active' : ''}`}
            onClick={() => setActiveTab('reservations')}
          >
            Car Reservations
          </button>
          <button
            className={`tab-button ${activeTab === 'testdrives' ? 'active' : ''}`}
            onClick={() => setActiveTab('testdrives')}
          >
            Test Drives
          </button>
        </div>

        {/* Filter Controls */}
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

      {/* Car Reservations Tab */}
      {activeTab === 'reservations' && (
        <>
          {filteredReservations.length === 0 ? (
            <p>No {filter} reservations found.</p>
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
                  {filteredReservations.map(booking => (
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
                              onClick={() => handleReservationStatusChange(booking.id, 'confirmed')}
                            >
                              Approve
                            </button>
                            <button
                              className="reject-btn"
                              onClick={() => handleReservationStatusChange(booking.id, 'canceled')}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <button
                            className="complete-btn"
                            onClick={() => handleReservationStatusChange(booking.id, 'completed')}
                          >
                            Mark Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Test Drives Tab */}
      {activeTab === 'testdrives' && (
        <>
          {filteredTestDrives.length === 0 ? (
            <p>No {filter} test drives found.</p>
          ) : (
            <div className="bookings-table-container">
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Car</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTestDrives.map(td => (
                    <tr key={td.id} className={`status-${td.status}`}>
                      <td>{td.id}</td>
                      <td>{td.user_name || `User-${td.user_id}`}</td>
                      <td>{td.car_brand} {td.car_model}</td>
                      <td>{new Date(td.test_drive_date).toLocaleDateString()}</td>
                      <td>{td.test_drive_time?.substring(0, 5)}</td>
                      <td>{td.location_name}</td>
                      <td>
                        <span className={`status-badge ${td.status}`}>
                          {td.status}
                        </span>
                      </td>
                      <td className="booking-actions">
                        {td.status === 'pending' && (
                          <>
                            <button
                              className="approve-btn"
                              onClick={() => handleTestDriveStatusChange(td.id, 'confirmed')}
                            >
                              Approve
                            </button>
                            <button
                              className="reject-btn"
                              onClick={() => handleTestDriveStatusChange(td.id, 'canceled')}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {td.status === 'confirmed' && (
                          <button
                            className="complete-btn"
                            onClick={() => handleTestDriveStatusChange(td.id, 'completed')}
                          >
                            Mark Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ApproveBookings;
