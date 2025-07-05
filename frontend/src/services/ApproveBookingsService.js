// src/services/ApproveBookingsService.js
import api from './api';

const ApproveBookingsService = {
  getAllBookings: async () => {
    return await api.get('/approve-bookings');
  },

  updateBookingStatus: async (id, status) => {
    return await api.put(`/approve-bookings/${id}/status`, { status });
  },

  addApprovedBooking: async (bookingData) => {
    return await api.post('/approve-bookings', bookingData);
  }
};

export default ApproveBookingsService;
