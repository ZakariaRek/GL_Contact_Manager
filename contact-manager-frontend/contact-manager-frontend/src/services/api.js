import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => {
    // Check if response.data exists and return the appropriate data
    if (response.data !== undefined) {
      return response.data;
    }
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || error.message;
    return Promise.reject(new Error(message));
  }
);
// Response interceptor for error handling
// api.interceptors.response.use(
//   (response) => response.data,
//   (error) => {
//     const message = error.response?.data?.message || error.message;
//     return Promise.reject(new Error(message));
//   }
// );

export default api;