import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSearch } from '../../context/SearchContext';
import { useNavigate } from 'react-router-dom';

const SearchForm = () => {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: new Date()
  });

  const { searchBuses, isLoading } = useSearch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      date: date
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.from || !formData.to || !formData.date) {
      alert('Please fill in all fields');
      return;
    }
    
    // Create a copy of the form data to avoid mutating state
    const searchData = {
      from: formData.from,
      to: formData.to,
      date: new Date(formData.date) // Ensure it's a Date object
    };
    
    console.log('Submitting search with:', searchData);
    
    const result = await searchBuses(searchData);
    
    if (result.success) {
      // Navigate to search results page with search parameters
      navigate('/search-results', { 
        state: { searchData: searchData }
      });
    } else {
      alert(result.error || 'Failed to search buses');
    }
  };

  return (
    <div className="bg-white bg-opacity-90 shadow-lg rounded-lg p-8 w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-800 text-sm font-medium mb-2">From</label>
            <input
              type="text"
              name="from"
              placeholder="Enter source"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-500 text-black"
              value={formData.from}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-gray-800 text-sm font-medium mb-2">To</label>
            <input
              type="text"
              name="to"
              placeholder="Enter destination"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-500 text-black"
              value={formData.to}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-gray-800 text-sm font-medium mb-2">Date of Journey</label>
          <DatePicker
            selected={formData.date}
            onChange={handleDateChange}
            className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-500"
            placeholderText="Select date"
            minDate={new Date()}
          />
        </div>
        <div className="text-center">
          <button 
            type="submit" 
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search Buses'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
