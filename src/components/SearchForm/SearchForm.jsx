import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaMapMarkerAlt, FaCalendarAlt, FaExchangeAlt, FaBus } from 'react-icons/fa';

const SearchForm = () => {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: new Date()
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, date: date }));
  };

  const handleSwap = () => {
    setFormData(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Your search logic here
    console.log('Searching for buses with:', formData);
  };

  return (
    <div className="bg-transparent w-full">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        
        {/* From Input */}
        <div className="md:col-span-4">
          <label className="block text-white text-sm font-medium mb-2">From</label>
          <div className="relative">
            <FaMapMarkerAlt className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="from"
              placeholder="Enter source"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-300 text-black"
              value={formData.from}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="md:col-span-1 text-center">
          <button
            type="button"
            onClick={handleSwap}
            className="bg-gray-200 hover:bg-gray-300 text-gray-600 p-3 rounded-full transition-transform duration-300 transform md:rotate-0 rotate-90"
            aria-label="Swap from and to destinations"
          >
            <FaExchangeAlt />
          </button>
        </div>

        {/* To Input */}
        <div className="md:col-span-4">
          <label className="block text-white text-sm font-medium mb-2">To</label>
          <div className="relative">
            <FaMapMarkerAlt className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="to"
              placeholder="Enter destination"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-300 text-black"
              value={formData.to}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Date Picker */}
        <div className="md:col-span-3">
          <label className="block text-white text-sm font-medium mb-2">Date</label>
          <div className="relative">
            <FaCalendarAlt className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            <DatePicker
              selected={formData.date}
              onChange={handleDateChange}
              className="w-full pl-10 pr-4 py-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-300"
              placeholderText="Select date"
              minDate={new Date()}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="md:col-span-12 text-center mt-4 md:items-center md:mx-auto">
          <button 
            type="submit" 
            className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-lg font-bold transition-colors w-full md:w-auto flex items-center justify-center gap-2"
          >
            <FaBus />
            <span>Search Buses</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;