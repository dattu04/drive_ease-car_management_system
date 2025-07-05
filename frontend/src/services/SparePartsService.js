import api from './api';

const SparePartsService = {
  // Get all spare parts (Employee only)
  getAllSpareParts: async () => {
    return await api.get('/spare-parts');
  },
  
  // Get spare part by ID
  getSparePartById: async (id) => {
    return await api.get(`/spare-parts/${id}`);
  },
  
  // Add spare part (Employee only)
  addSparePart: async (partData) => {
    return await api.post('/spare-parts', partData);
  },
  
  // Update spare part (Employee only)
  updateSparePart: async (id, partData) => {
    return await api.put(`/spare-parts/${id}`, partData);
  },
  
  // Delete spare part (Employee only)
  deleteSparePart: async (id) => {
    return await api.delete(`/spare-parts/${id}`);
  }
};

export default SparePartsService;