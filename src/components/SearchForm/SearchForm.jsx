import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSearch } from '../../context/SearchContext'; // Adjust path if needed
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaBus } from 'react-icons/fa';
import { HiArrowsUpDown } from 'react-icons/hi2';

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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, date: date }));
  };

  const handleSwap = () => {
    setFormData(prev => ({ ...prev, from: prev.to, to: prev.from }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.from || !formData.to || !formData.date) {
      alert('Please fill in all fields');
      return;
    }
    const searchData = { ...formData };
    const result = await searchBuses(searchData);
    if (result.success) {
      navigate('/search-results', { state: { searchData } });
    } else {
      alert(result.error || 'Failed to search buses');
    }
  };

  return (
    <div className="bg-white/20 backdrop-blur-lg p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit}>
        
        {/* Top row for all inputs - uses flexbox for alignment */}
        <div className="flex flex-col lg:flex-row lg:items-end gap-6">
          
          {/* From/To and Swap group */}
          <div className="flex-1 flex flex-col lg:flex-row items-center gap-4">
            {/* From Input */}
            <div className="w-full lg:flex-1">
              <label className="block text-white text-sm font-medium mb-2">From</label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text" name="from" placeholder="Enter source"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-300 text-black"
                  value={formData.from} onChange={handleChange} required
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="lg:mt-8">
              <button
                type="button" onClick={handleSwap}
                className="bg-gray-200 hover:bg-gray-300 text-gray-600 p-3 rounded-full transition-colors duration-300 transform lg:rotate-0 rotate-90"
                aria-label="Swap from and to destinations"
              >
                <HiArrowsUpDown className="h-5 w-5" />
              </button>
            </div>

            {/* To Input */}
            <div className="w-full lg:flex-1">
              <label className="block text-white text-sm font-medium mb-2">To</label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text" name="to" placeholder="Enter destination"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-300 text-black"
                  value={formData.to} onChange={handleChange} required
                />
              </div>
            </div>
          </div>

          {/* Date Picker */}
          <div className="w-full lg:w-52">
            <label className="block text-white text-sm font-medium mb-2">Date of Journey</label>
            <div className="relative">
              <FaCalendarAlt className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
              <DatePicker
                selected={formData.date} onChange={handleDateChange}
                className="w-full pl-10 pr-4 py-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-300"
                minDate={new Date()}
              />
            </div>
          </div>
        </div>

        {/* Submit Button Row */}
        <div className="mt-8 text-center">
          <button 
            type="submit" disabled={isLoading}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 disabled:bg-green-400 disabled:cursor-not-allowed mx-auto"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Searching...</span>
              </>
            ) : (
              <>
                <FaBus />
                <span>Search Buses</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;