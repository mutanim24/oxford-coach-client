/**
 * Utility functions for localStorage operations
 */

/**
 * Safely parse localStorage item
 * @param {string} key - The key to retrieve from localStorage
 * @returns {any|null} Parsed value or null if parsing fails or key doesn't exist
 */
export const safeGetLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null || item === undefined) {
      return null;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error parsing localStorage item with key "${key}":`, error);
    // Clear the invalid item
    localStorage.removeItem(key);
    return null;
  }
};

/**
 * Clean up invalid localStorage items that might cause JSON.parse errors
 */
export const cleanupInvalidLocalStorage = () => {
  const keysToCheck = ['user', 'token', 'auth'];
  
  keysToCheck.forEach(key => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        if (key === 'token') {
          // For JWT tokens, just check if it's a non-empty string
          // JWT tokens are base64 encoded, not JSON
          if (typeof item !== 'string' || item.trim() === '') {
            throw new Error('Token is not a valid string');
          }
        } else {
          // For other items, try to parse as JSON
          JSON.parse(item);
        }
      }
    } catch (error) {
      console.error(`Invalid localStorage item found for key "${key}", removing it.`, error);
      localStorage.removeItem(key);
    }
  });
};

/**
 * Check if localStorage has valid authentication data
 * @returns {boolean} True if valid token and user exist
 */
export const hasValidAuthData = () => {
  const token = localStorage.getItem('token');
  const user = safeGetLocalStorage('user');
  
  return !!(token && user);
};
