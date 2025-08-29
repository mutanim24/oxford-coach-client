import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ScheduleForm = ({ initialData, onSubmit, onClose, busId, allBuses }) => {
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    departureTime: '',
    fare: ''
  });
  
  const [selectedBusId, setSelectedBusId] = useState('');
  const [selectedBusDetails, setSelectedBusDetails] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        source: initialData.source || '',
        destination: initialData.destination || '',
        departureTime: initialData.departureTime ? 
          new Date(initialData.departureTime).toISOString().slice(0, 16) : '',
        fare: initialData.fare || ''
      });
      
      // Set the selected bus ID if editing
      if (initialData.bus) {
        setSelectedBusId(initialData.bus._id || initialData.bus);
        
        // Find and set the bus details
        const bus = allBuses.find(b => b._id === (initialData.bus._id || initialData.bus));
        if (bus) {
          setSelectedBusDetails(bus);
        }
      }
    } else if (busId && allBuses.length > 0) {
      // If we're adding a schedule for a specific bus, pre-select it
      setSelectedBusId(busId);
      const bus = allBuses.find(b => b._id === busId);
      if (bus) {
        setSelectedBusDetails(bus);
      }
    }
  }, [initialData, busId, allBuses]);

  // Auto-fill logic when bus is selected
  useEffect(() => {
    if (selectedBusId && allBuses.length > 0) {
      const bus = allBuses.find(b => b._id === selectedBusId);
      if (bus) {
        setSelectedBusDetails(bus);
      } else {
        setSelectedBusDetails(null);
      }
    } else {
      setSelectedBusDetails(null);
    }
  }, [selectedBusId, allBuses]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedBusId) {
      newErrors.bus = 'Please select a bus';
    }
    
    if (!formData.source.trim()) {
      newErrors.source = 'Source is required';
    }
    
    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }
    
    if (!formData.departureTime) {
      newErrors.departureTime = 'Departure time is required';
    }
    
    if (!formData.fare || formData.fare <= 0) {
      newErrors.fare = 'Valid fare is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBusChange = (e) => {
    const value = e.target.value;
    setSelectedBusId(value);
    
    // Clear error when user selects a bus
    if (errors.bus) {
      setErrors(prev => ({
        ...prev,
        [errors.bus]: ''
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('handleSubmit called');
    console.log('Form data:', formData);
    console.log('Selected bus ID:', selectedBusId);
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const scheduleData = {
        busId: selectedBusId, // Use the selected bus ID
        source: formData.source,
        destination: formData.destination,
        departureTime: new Date(formData.departureTime).toISOString(), // Convert to ISO string
        fare: parseFloat(formData.fare) // Ensure fare is a number
      };
      
      console.log('Submitting schedule data:', scheduleData);
      
      await onSubmit(scheduleData);
      console.log('Form submitted successfully');
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Handle authentication errors
      if (error.response && error.response.status === 401) {
        toast.error('Please log in to manage schedules.');
        // Redirect to login page
        window.location.href = '/login';
        return;
      }
      
      // Handle admin privilege errors
      if (error.response && error.response.status === 403) {
        toast.error('You do not have permission to manage schedules. Please contact an administrator.');
        return;
      }
      
      // Handle other errors
      toast.error('Failed to save schedule. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {initialData ? 'Edit Schedule' : 'Add New Schedule'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Select a Bus
            </label>
            <select
              value={selectedBusId}
              onChange={handleBusChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.bus ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
              }`}
            >
              <option value="">Choose a bus...</option>
              {allBuses.map((bus) => (
                <option key={bus._id} value={bus._id}>
                  {bus.name || bus.operator} - {bus.busType}
                </option>
              ))}
            </select>
            {errors.bus && (
              <p className="text-red-500 text-sm mt-1">{errors.bus}</p>
            )}
          </div>
          
          {/* Auto-filled bus details */}
          {selectedBusDetails && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Bus Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Bus Name:</span>
                  <span className="ml-2 font-medium">{selectedBusDetails.name || selectedBusDetails.operator}</span>
                </div>
                <div>
                  <span className="text-gray-600">Operator:</span>
                  <span className="ml-2 font-medium">{selectedBusDetails.operator}</span>
                </div>
                <div>
                  <span className="text-gray-600">Bus Type:</span>
                  <span className="ml-2 font-medium">{selectedBusDetails.busType}</span>
                </div>
                <div>
                  <span className="text-gray-600">Total Seats:</span>
                  <span className="ml-2 font-medium">{selectedBusDetails.totalSeats}</span>
                </div>
                <div>
                  <span className="text-gray-600">Amenities:</span>
                  <span className="ml-2 font-medium">
                    {selectedBusDetails.amenities && selectedBusDetails.amenities.length > 0 
                      ? selectedBusDetails.amenities.join(', ') 
                      : 'None'}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Source
              </label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.source ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
                placeholder="Enter source location"
              />
              {errors.source && (
                <p className="text-red-500 text-sm mt-1">{errors.source}</p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Destination
              </label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.destination ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
                placeholder="Enter destination"
              />
              {errors.destination && (
                <p className="text-red-500 text-sm mt-1">{errors.destination}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Departure Time
              </label>
              <input
                type="datetime-local"
                name="departureTime"
                value={formData.departureTime}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.departureTime ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
              />
              {errors.departureTime && (
                <p className="text-red-500 text-sm mt-1">{errors.departureTime}</p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Fare ($)
              </label>
              <input
                type="number"
                name="fare"
                value={formData.fare}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.fare ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
                placeholder="Enter fare"
                min="0"
                step="0.01"
              />
              {errors.fare && (
                <p className="text-red-500 text-sm mt-1">{errors.fare}</p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : initialData ? 'Update Schedule' : 'Add Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleForm;
