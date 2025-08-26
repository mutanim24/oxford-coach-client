import axios from 'axios';

// Create a new Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token to every request
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    if (error.response && error.response.status === 401) {
      // Only clear token and redirect for auth-related errors (e.g., invalid/expired token)
      // Don't clear token for authorization errors (e.g., insufficient permissions)
      if (!error.config.url.includes('/auth/admin')) {
        localStorage.removeItem('token');
        // Optionally redirect to login
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
