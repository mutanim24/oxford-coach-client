import React, { useState, useEffect } from 'react';
import busService from '../../services/busService';

const BusForm = ({ busId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    operator: '',
    busType: 'AC',
    totalSeats: '',
    amenities: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [amenityInput, setAmenityInput] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    if (busId) {
      const fetchBus = async () => {
        try {
          setLoading(true);
          const bus = await busService.getBusById(busId);
          setFormData({
            name: bus.name || '',
            operator: bus.operator,
            busType: bus.busType,
            totalSeats: bus.totalSeats,
            amenities: bus.amenities || []
          });
        } catch (err) {
          setError('Failed to fetch bus details');
          setToast({ show: true, message: 'Failed to fetch bus details', type: 'error' });
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchBus();
    }
  }, [busId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddAmenity = () => {
    if (amenityInput.trim() && !formData.amenities.includes(amenityInput.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()]
      }));
      setAmenityInput('');
    }
  };

  const handleRemoveAmenity = (index) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const busData = {
        ...formData,
        totalSeats: parseInt(formData.totalSeats)
      };

      if (busId) {
        await busService.updateBus(busId, busData);
      } else {
        await busService.createBus(busData);
      }

      onSuccess();
      onClose();
      setToast({ show: true, message: busId ? 'Bus updated successfully!' : 'Bus added successfully!', type: 'success' });
    } catch (err) {
      setError('Failed to save bus');
      setToast({ show: true, message: 'Failed to save bus', type: 'error' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{busId ? 'Edit Bus' : 'Add New Bus'}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Bus Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter bus name (optional)"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="operator">
                Operator
              </label>
              <input
                type="text"
                id="operator"
                name="operator"
                value={formData.operator}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter operator name"
                required
              />
            </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="busType">
              Bus Type
            </label>
            <select
              id="busType"
              name="busType"
              value={formData.busType}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="AC">AC</option>
              <option value="Non-AC">Non-AC</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="totalSeats">
              Total Seats
            </label>
            <input
              type="number"
              id="totalSeats"
              name="totalSeats"
              value={formData.totalSeats}
              onChange={handleChange}
              min="1"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter total number of seats"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Amenities
            </label>
            <div className="flex mb-2">
              <input
                type="text"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                placeholder="Add amenity"
                className="shadow appearance-none border rounded-l w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
              />
              <button
                type="button"
                onClick={handleAddAmenity}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.amenities.map((amenity, index) => (
                <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                  {amenity}
                  <button
                    type="button"
                    onClick={() => handleRemoveAmenity(index)}
                    className="ml-2 text-blue-800 hover:text-blue-900"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? 'Saving...' : (busId ? 'Update' : 'Add')}
            </button>
          </div>
        </form>
      </div>
      
      {toast.show && (
        <div className="fixed inset-0 flex items-start justify-end pt-4 pr-4 z-50">
          <div className={`${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white px-6 py-3 rounded-lg shadow-lg flex items-center`}>
            <span>{toast.message}</span>
            <button
              onClick={() => setToast({ ...toast, show: false })}
              className="ml-4 text-white hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusForm;
