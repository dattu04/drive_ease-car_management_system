import api from './api';

const ServiceRequestService = {
  // Get all services (Employee only)
  getAllServices: async () => {
    return await api.get('/services');
  },
  
  // Get service by ID
  getServiceById: async (id) => {
    return await api.get(`/services/${id}`);
  },
  
  // Add service
  addService: async (serviceData) => {
    return await api.post('/services', serviceData);
  },
  
  // Update service status (Employee only)
  updateServiceStatus: async (id, status) => {
    return await api.put(`/services/${id}/status`, { status });
  },
  
  // Update service details (Employee only)
  updateService: async (id, serviceData) => {
    return await api.put(`/services/${id}`, serviceData);
  },
  
  // Delete service (Employee only)
  deleteService: async (id) => {
    return await api.delete(`/services/${id}`);
  },
  
  // Get user's services (for customers)
  getUserServices: async (userId) => {
    return await api.get(`/services/user/${userId}`);
  },
  
  // Get services by location
  getServicesByLocation: async (locationId) => {
    return await api.get(`/services/location/${locationId}`);
  },
  
  // Function to get user's vehicles (assuming this exists elsewhere)
  getUserVehicles: async (userId) => {
    return await api.get(`/users/${userId}/cars`);
  }
};

export default ServiceRequestService;