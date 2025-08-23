import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const SearchContext = createContext();

export const useSearch = () => {
  return useContext(SearchContext);
};

export const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchBuses = async (searchData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Format date for API (YYYY-MM-DD)
      const formattedDate = searchData.date.toISOString().split('T')[0];
      
      const response = await axios.get('http://localhost:5000/api/search', {
        params: {
          source: searchData.from,
          destination: searchData.to,
          date: formattedDate
        }
      });
      
      setSearchResults(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Search error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to search buses';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
    setError(null);
  };

  const value = {
    searchResults,
    isLoading,
    error,
    searchBuses,
    clearSearch
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};
