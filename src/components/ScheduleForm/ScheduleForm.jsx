import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiLoader, FiAlertCircle, FiChevronDown } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FormInput = ({ label, error, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input {...props} className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 transition-shadow ${error ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-green-500'}`} />
    <AnimatePresence>
      {error && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-600 text-sm mt-1 flex items-center gap-1"><FiAlertCircle size={14} />{error}</motion.p>}
    </AnimatePresence>
  </div>
);

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
        departureTime: initialData.departureTime ? new Date(initialData.departureTime).toISOString().slice(0, 16) : '',
        fare: initialData.fare || ''
      });
      const busIdentifier = initialData.bus?._id || initialData.bus;
      setSelectedBusId(busIdentifier);
    } else if (busId) {
      setSelectedBusId(busId);
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [initialData, busId, onClose]);

  useEffect(() => {
    if (selectedBusId && allBuses.length > 0) {
      const bus = allBuses.find(b => b._id === selectedBusId);
      setSelectedBusDetails(bus || null);
    } else {
      setSelectedBusDetails(null);
    }
  }, [selectedBusId, allBuses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleBusChange = (e) => {
    setSelectedBusId(e.target.value);
    if (errors.bus) {
      setErrors(prev => ({ ...prev, bus: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!selectedBusId) newErrors.bus = 'Please select a bus';
    if (!formData.source.trim()) newErrors.source = 'Source is required';
    if (!formData.destination.trim()) newErrors.destination = 'Destination is required';
    if (!formData.departureTime) newErrors.departureTime = 'Departure time is required';
    if (!formData.fare || formData.fare <= 0) newErrors.fare = 'A valid fare is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    try {
      const scheduleData = {
        busId: selectedBusId,
        source: formData.source,
        destination: formData.destination,
        departureTime: new Date(formData.departureTime).toISOString(),
        fare: parseFloat(formData.fare)
      };
      await onSubmit(scheduleData);
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-end z-50"
    >
      <motion.div
        initial={{ x: '100%' }} animate={{ x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } }} exit={{ x: '100%', transition: { duration: 0.2 } }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-lg h-full flex flex-col shadow-2xl"
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">{initialData ? 'Edit Schedule' : 'Add New Schedule'}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <FiX className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-grow p-6 space-y-6 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Bus</label>
            <div className="relative">
              <select
                value={selectedBusId} onChange={handleBusChange}
                className={`w-full appearance-none bg-white border rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 transition-shadow ${errors.bus ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-green-500'}`}
              >
                <option value="" disabled>Choose a bus...</option>
                {allBuses.map((bus) => (<option key={bus._id} value={bus._id}>{bus.name || bus.operator} ({bus.busType})</option>))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <AnimatePresence>
              {errors.bus && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-600 text-sm mt-1 flex items-center gap-1"><FiAlertCircle size={14} />{errors.bus}</motion.p>}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {selectedBusDetails && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg">
                <h3 className="text-sm font-bold mb-2">Selected Bus Details</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <p><strong>Operator:</strong> {selectedBusDetails.operator}</p>
                  <p><strong>Type:</strong> {selectedBusDetails.busType}</p>
                  <p><strong>Seats:</strong> {selectedBusDetails.totalSeats}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Source" name="source" value={formData.source} onChange={handleChange} placeholder="e.g., New York" error={errors.source} />
            <FormInput label="Destination" name="destination" value={formData.destination} onChange={handleChange} placeholder="e.g., Boston" error={errors.destination} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Departure Time" name="departureTime" type="datetime-local" value={formData.departureTime} onChange={handleChange} error={errors.departureTime} />
            <FormInput label="Fare ($)" name="fare" type="number" min="0" step="0.01" value={formData.fare} onChange={handleChange} placeholder="e.g., 25.50" error={errors.fare} />
          </div>
        </form>

        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-5 rounded-lg border transition-colors">
            Cancel
          </button>
          {/* === FIX #2: Rely ONLY on the form's `onSubmit` by using `type="submit"` and removing onClick === */}
          <button
            type="submit"
            onClick={handleSubmit} // This now correctly triggers the form's onSubmit handler
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting && <FiLoader className="animate-spin" />}
            {isSubmitting ? 'Saving...' : initialData ? 'Update Schedule' : 'Add Schedule'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ScheduleForm;