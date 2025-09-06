import api from './api';

const API_URL = '/buses';

// Get all buses
const getBuses = async () => {
  const response = await api.get(API_URL);
  return response.data.data;
};

// Get bus by ID
const getBusById = async (id) => {
  const response = await api.get(`${API_URL}/${id}`);
  return response.data.data;
};

// Create a new bus
const createBus = async (busData) => {
  const response = await api.post(API_URL, busData);
  return response.data.data;
};

// Update a bus
const updateBus = async (id, busData) => {
  const response = await api.put(`${API_URL}/${id}`, busData);
  return response.data.data;
};

// Delete a bus
const deleteBus = async (id) => {
  const response = await api.delete(`${API_URL}/${id}`);
  return response.data;
};

const busService = {
  getBuses,
  getBusById,
  createBus,
  updateBus,
  deleteBus
};

export default busService; 
