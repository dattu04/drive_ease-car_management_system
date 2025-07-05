import api from './api';

const CarService = {
  // Get all cars (Public access)
  getAllCars: async () => {
    return await api.get('/cars');
  },
  
  // Get car by ID
  getCarById: async (id) => {
    return await api.get(`/cars/${id}`);
  },
  
  // Add car (Supervisor only)
  addCar: async (carData) => {
    return await api.post('/cars', carData);
  },
  
  // Update car (Supervisor only)
  updateCar: async (id, carData) => {
    return await api.put(`/cars/${id}`, carData);
  },
  
  // Delete car (Supervisor only)
  deleteCar: async (id) => {
    return await api.delete(`/cars/${id}`);
  }
};

export default CarService;