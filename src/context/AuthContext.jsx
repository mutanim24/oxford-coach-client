import React, { createContext, useReducer, useEffect } from 'react';
import { cleanupInvalidLocalStorage, safeGetLocalStorage, hasValidAuthData } from '../utils/localStorageUtils';
import { authReducer, initialState } from '../reducers/authReducer';
import { AUTH_SUCCESS, AUTH_ERROR, LOGOUT, CLEAR_ERROR, SET_LOADING } from '../constants/authConstants';
import api from '../services/api';

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user on app start
  useEffect(() => {
    // Clean up any invalid localStorage items first
    cleanupInvalidLocalStorage();
    
    if (hasValidAuthData()) {
      // Retrieve token as plain string
      const token = localStorage.getItem('token');
      // Retrieve user object and parse it from JSON
      const user = safeGetLocalStorage('user');
      
      if (token && user) {
        dispatch({
          type: AUTH_SUCCESS,
          payload: { user, token }
        });
      } else {
        dispatch({ type: SET_LOADING, payload: false });
      }
    } else {
      dispatch({ type: SET_LOADING, payload: false });
    }
  }, []);

  // Login function
  const login = async (credentials) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const response = await api.post('/auth/login', credentials);
      const data = response.data;

      // For axios, successful responses have status 200
      if (data && data.user && data.token) {
        // Store token as plain string
        localStorage.setItem('token', data.token);
        // Store user object as JSON string
        localStorage.setItem('user', JSON.stringify(data.user));
        
        dispatch({
          type: AUTH_SUCCESS,
          payload: {
            user: data.user,
            token: data.token
          }
        });
        
        return { success: true, user: data.user };
      } else {
        // Handle cases where response is ok but data is incomplete
        dispatch({
          type: AUTH_ERROR,
          payload: 'Invalid response data from server'
        });
        return { success: false, message: 'Invalid response data from server' };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle axios error responses
      let errorMessage = 'Login failed';
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.data && error.response.data.errors) {
          // Handle validation errors
          errorMessage = error.response.data.errors.map(err => err.msg).join(', ');
        } else if (error.response.data && error.response.data.error) {
          // Handle specific errors
          errorMessage = error.response.data.error;
        } else if (error.response.data && error.response.data.message) {
          // Handle other error messages
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'Network error. Please check your connection.';
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = 'An error occurred. Please try again.';
      }
      
      dispatch({
        type: AUTH_ERROR,
        payload: errorMessage
      });
      return { success: false, message: errorMessage };
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      const response = await api.post('/auth/register', userData);
      const data = response.data;

      // For axios, successful responses have status 200
      if (data && data.user && data.token) {
        // Store token as plain string
        localStorage.setItem('token', data.token);
        // Store user object as JSON string
        localStorage.setItem('user', JSON.stringify(data.user));
        
        dispatch({
          type: AUTH_SUCCESS,
          payload: {
            user: data.user,
            token: data.token
          }
        });
        
        return { success: true, user: data.user };
      } else {
        // Handle cases where response is ok but data is incomplete
        dispatch({
          type: AUTH_ERROR,
          payload: 'Invalid response data from server'
        });
        return { success: false, message: 'Invalid response data from server' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle axios error responses
      let errorMessage = 'Registration failed';
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.data && error.response.data.errors) {
          // Handle validation errors
          errorMessage = error.response.data.errors.map(err => err.msg).join(', ');
        } else if (error.response.data && error.response.data.error) {
          // Handle specific errors like email already in use
          errorMessage = error.response.data.error;
        } else if (error.response.data && error.response.data.message) {
          // Handle other error messages
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'Network error. Please check your connection.';
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = 'An error occurred. Please try again.';
      }
      
      dispatch({
        type: AUTH_ERROR,
        payload: errorMessage
      });
      return { success: false, message: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: LOGOUT });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: CLEAR_ERROR });
  };

  // Context value
  const contextValue = {
    ...state,
    login,
    register,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the context directly for useContext hook
export { AuthContext };
