// src/services/api.js
import axios from 'axios';

// Create an axios instance with defaults configured for your backend
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Change this to match your Node.js backend URL
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;