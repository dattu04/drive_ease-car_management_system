// services/SparePartBookingService.js
import api from './api';

const SparePartBookingService = {
  // Book a spare part (Customer)
  bookSparePart: async (bookingData) => {
    return await api.post('/spare-bookings', bookingData);
  },

  // Get current user's bookings (Customer)
  getMyBookings: async () => {
    return await api.get('/spare-bookings/my');
  },

  // Get all bookings (Admin/Employee)
  getAllBookings: async () => {
    return await api.get('/spare-bookings');
  }
};

export default SparePartBookingService;
