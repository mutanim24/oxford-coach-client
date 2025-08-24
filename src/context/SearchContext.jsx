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
      const formattedDate = searchData.date instanceof Date 
        ? searchData.date.toISOString().split('T')[0] 
        : searchData.date;
      
      console.log('Searching with parameters:', {
        source: searchData.from,
        destination: searchData.to,
        date: formattedDate
      });
      
      const response = await axios.get('http://localhost:5000/api/search', {
        params: {
          source: searchData.from,
          destination: searchData.to,
          date: formattedDate
        }
      });
      
      console.log('Search response:', response.data);
      
      // Ensure we have an array, even if the API returns a single object
      const results = Array.isArray(response.data) ? response.data : [response.data].filter(Boolean);
      
      setSearchResults(results);
      return { success: true, data: results };
    } catch (err) {
      console.error('Search error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to search buses';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const searchBusesWithoutDate = async (source, destination) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Searching without date filter with parameters:', {
        source,
        destination
      });
      
      const response = await axios.get('http://localhost:5000/api/search', {
        params: {
          source,
          destination,
          date: new Date().toISOString().split('T')[0] // Use today's date as a placeholder
        }
      });
      
      console.log('Search response without date filter:', response.data);
      
      // Ensure we have an array, even if the API returns a single object
      const results = Array.isArray(response.data) ? response.data : [response.data].filter(Boolean);
      
      setSearchResults(results);
      return { success: true, data: results };
    } catch (err) {
      console.error('Search error without date filter:', err);
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
    searchBusesWithoutDate,
    clearSearch
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};
