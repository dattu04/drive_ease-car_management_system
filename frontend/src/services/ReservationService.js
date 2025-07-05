import api from './api';

const ReservationService = {
  // Get all reservations
  getAllReservations: async () => {
    return await api.get('/reservations');
  },
  
  // Get reservation by ID
  getReservationById: async (id) => {
    return await api.get(`/reservations/${id}`);
  },
  
  // Add reservation (Employee only)
  addReservation: async (reservationData) => {
    return await api.post('/reservations', reservationData);
  },
  
  // Update reservation (Supervisor only)
  updateReservation: async (id, reservationData) => {
    return await api.put(`/reservations/${id}`, reservationData);
  },
  
  // Delete reservation (Supervisor only)
  deleteReservation: async (id) => {
    return await api.delete(`/reservations/${id}`);
  },
  
  // Get user's reservations (for customers to see their own)
  getUserReservations: async (userId) => {
    return await api.get(`/reservations/user/${userId}`);
  }
};

export default ReservationService;