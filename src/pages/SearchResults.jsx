import React, { useEffect } from 'react';
import { useSearch } from '../context/SearchContext';
import { useLocation } from 'react-router-dom';
import BusCard from '../components/BusCard/BusCard';

const SearchResults = () => {
  const { searchResults, isLoading, error, searchBusesWithoutDate } = useSearch();
  const location = useLocation();
  
  // Get search parameters from location state or URL params
  const searchParams = location.state?.searchData || null;
  
  // Check if we're loading from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const source = params.get('source');
    const destination = params.get('destination');
    
    if (source && destination && !searchParams) {
      searchBusesWithoutDate(source, destination);
    }
  }, [location.search, searchParams, searchBusesWithoutDate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading search results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <div className="text-red-500 text-center mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Search Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Search Results</h1>
          {searchParams && (
            <p className="text-gray-600">
              Showing buses from <span className="font-medium">{searchParams.from}</span> to 
              <span className="font-medium"> {searchParams.to}</span> on 
              <span className="font-medium"> {searchParams.date instanceof Date ? searchParams.date.toLocaleDateString() : searchParams.date}</span>
            </p>
          )}
        </div>

        {searchResults.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Buses Found</h2>
            <p className="text-gray-600 mb-4">
              We couldn't find any buses for your selected route and date. Please try different search criteria.
            </p>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Tips for better search results:</p>
              <ul className="text-sm text-gray-600 text-left max-w-md mx-auto">
                <li className="mb-1">• Check the spelling of your source and destination</li>
                <li className="mb-1">• Try nearby cities or locations</li>
                <li className="mb-1">• Select a different date</li>
                <li>• Try a more general search (e.g., just city names)</li>
              </ul>
            </div>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => window.history.back()}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Search Again
              </button>
              <button 
                onClick={() => {
                  // Try searching without date filter
                  if (searchParams) {
                    const { from, to } = searchParams;
                    searchBusesWithoutDate(from, to);
                  }
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Show All Buses for This Route
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((schedule) => (
              <BusCard key={schedule._id} schedule={schedule} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
