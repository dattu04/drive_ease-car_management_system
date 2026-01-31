import api from './api';

const TestDriveService = {
  // Get all test drives
  getAllTestDrives: async () => {
    return await api.get('/testdrives');
  },

  // Get test drive by ID
  getTestDriveById: async (id) => {
    return await api.get(`/testdrives/${id}`);
  },

  // Get user's test drives
  getUserTestDrives: async (userId) => {
    return await api.get(`/testdrives/user/${userId}`);
  },

  // Add test drive booking
  addTestDrive: async (testDriveData) => {
    return await api.post('/testdrives', testDriveData);
  },

  // Update test drive (Supervisor only)
  updateTestDrive: async (id, testDriveData) => {
    return await api.put(`/testdrives/${id}`, testDriveData);
  },

  // Delete test drive (Supervisor only)
  deleteTestDrive: async (id) => {
    return await api.delete(`/testdrives/${id}`);
  }
};

export default TestDriveService;