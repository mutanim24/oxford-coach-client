import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus, FiLoader, FiAlertCircle } from 'react-icons/fi';
import busService from '../../services/busService';

// === FIX #1: DEFINE HELPER COMPONENTS OUTSIDE THE MAIN COMPONENT ===
// This prevents them from being recreated on every render, which fixes the input focus bug.
const FormInput = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input {...props} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow" />
    </div>
);

const FormSelect = ({ label, children, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select {...props} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow bg-white">
            {children}
        </select>
    </div>
);

const BusForm = ({ busId, onClose, onSuccess }) => {
  // All your state and logic functions remain completely unchanged
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

  useEffect(() => {
    if (busId) {
      setLoading(true);
      const fetchBus = async () => {
        try {
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
        } finally {
          setLoading(false);
        }
      };
      fetchBus();
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [busId, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAmenity = () => {
    if (amenityInput.trim() && !formData.amenities.includes(amenityInput.trim())) {
      setFormData(prev => ({ ...prev, amenities: [...prev.amenities, amenityInput.trim()] }));
      setAmenityInput('');
    }
  };

  const handleRemoveAmenity = (amenityToRemove) => {
    setFormData(prev => ({ ...prev, amenities: prev.amenities.filter(a => a !== amenityToRemove) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const busData = { ...formData, totalSeats: parseInt(formData.totalSeats) };
      if (busId) {
        await busService.updateBus(busId, busData);
      } else {
        await busService.createBus(busData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to save bus. Please check all required fields.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const panelVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { x: '100%', opacity: 0, transition: { duration: 0.2 } }
  };
  
  return (
    // NOTE: AnimatePresence wrapper is correctly placed in the PARENT component (ManageBuses.jsx)
    <motion.div
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-end z-50"
    >
      <motion.div
        variants={panelVariants}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-lg h-full flex flex-col shadow-2xl"
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">{busId ? 'Edit Bus' : 'Add New Bus'}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <FiX className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-grow p-6 space-y-6 overflow-y-auto">
          {error && 
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-center gap-3">
              <FiAlertCircle /> <span>{error}</span>
            </div>
          }
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Operator" name="operator" value={formData.operator} onChange={handleChange} placeholder="e.g., Green Line" required />
              <FormInput label="Bus Name / Number" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Express G-7" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormSelect label="Bus Type" name="busType" value={formData.busType} onChange={handleChange}>
                  <option value="AC">AC</option>
                  <option value="Non-AC">Non-AC</option>
              </FormSelect>
              <FormInput label="Total Seats" name="totalSeats" type="number" min="1" value={formData.totalSeats} onChange={handleChange} placeholder="e.g., 40" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amenities</label>
            <div className="flex gap-2">
              <input type="text" value={amenityInput} onChange={(e) => setAmenityInput(e.target.value)} placeholder="Add amenity and press Enter" className="flex-grow border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow" onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddAmenity(); }}}/>
              <button type="button" onClick={handleAddAmenity} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"><FiPlus /></button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3 min-h-[2.5rem]">
                {formData.amenities.map((amenity) => (
                  <motion.div key={amenity} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-2 text-sm">
                    {amenity}
                    <button type="button" onClick={() => handleRemoveAmenity(amenity)} className="text-green-600 hover:text-green-800"><FiX size={14} /></button>
                  </motion.div>
                ))}
            </div>
          </div>
        </form>

        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-5 rounded-lg border transition-colors">Cancel</button>
          
          {/* === FIX #2: Rely ONLY on the form's `onSubmit` by using `type="submit"` === */}
          <button
            type="submit"
            onClick={handleSubmit} // This now correctly triggers the form's onSubmit
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <FiLoader className="animate-spin" />}
            {loading ? 'Saving...' : (busId ? 'Update Bus' : 'Add Bus')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BusForm;