import api from './api';

const API_URL = '/auth';

// Register user
export const registerUser = async (userData) => {
  try {
    const response = await api.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error('Registration service error:', error);
    throw error;
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const response = await api.post(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    console.error('Login service error:', error);
    throw error;
  }
};

// Get user profile (protected route example)
export const getUserProfile = async () => {
  try {
    const response = await api.get(`${API_URL}/profile`);
    return response.data;
  } catch (error) {
    console.error('Get user profile error:', error);
    throw error;
  }
};

// Logout user (client-side only)
export const logoutUser = () => {
  // Clear localStorage
  localStorage.removeItem('token');
  
  // Note: We don't need to remove the auth header from the api instance
  // as the interceptor will automatically add the token if it exists
};
