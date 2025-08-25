import React, { createContext, useReducer, useEffect } from 'react';
import { cleanupInvalidLocalStorage, safeGetLocalStorage, hasValidAuthData } from '../utils/localStorageUtils';
import { authReducer, initialState } from '../reducers/authReducer';
import { AUTH_SUCCESS, AUTH_ERROR, LOGOUT, CLEAR_ERROR, SET_LOADING } from '../constants/authConstants';

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
      const token = localStorage.getItem('token');
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
      // Replace with your actual API call
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (response.ok) {
        // Ensure data and data.user exist before storing
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
          
          return { success: true };
        } else {
          // Handle cases where response is ok but data is incomplete
          dispatch({
            type: AUTH_ERROR,
            payload: 'Invalid response data from server'
          });
          return { success: false, message: 'Invalid response data from server' };
        }
      } else {
        // Handle non-OK responses (like 400)
        const errorMessage = data && data.message ? data.message : 'Login failed';
        dispatch({
          type: AUTH_ERROR,
          payload: errorMessage
        });
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error('Login error:', error);
      dispatch({
        type: AUTH_ERROR,
        payload: 'Network error. Please try again.'
      });
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: SET_LOADING, payload: true });
    try {
      // Replace with your actual API call
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        // Ensure data and data.user exist before storing
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
          
          return { success: true };
        } else {
          // Handle cases where response is ok but data is incomplete
          dispatch({
            type: AUTH_ERROR,
            payload: 'Invalid response data from server'
          });
          return { success: false, message: 'Invalid response data from server' };
        }
      } else {
        // Handle non-OK responses
        const errorMessage = data && data.message ? data.message : 'Registration failed';
        dispatch({
          type: AUTH_ERROR,
          payload: errorMessage
        });
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error('Registration error:', error);
      dispatch({
        type: AUTH_ERROR,
        payload: 'Network error. Please try again.'
      });
      return { success: false, message: 'Network error. Please try again.' };
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
