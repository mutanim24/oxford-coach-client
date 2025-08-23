import axios from 'axios';

const API_URL = '/api/buses';

// Get all buses
const getBuses = async () => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  };
  
  const response = await axios.get(API_URL, config);
  return response.data.data;
};

// Get bus by ID
const getBusById = async (id) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  };
  
  const response = await axios.get(`${API_URL}/${id}`, config);
  return response.data.data;
};

// Create a new bus
const createBus = async (busData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  };
  
  const response = await axios.post(API_URL, busData, config);
  return response.data.data;
};

// Update a bus
const updateBus = async (id, busData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  };
  
  const response = await axios.put(`${API_URL}/${id}`, busData, config);
  return response.data.data;
};

// Delete a bus
const deleteBus = async (id) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  };
  
  const response = await axios.delete(`${API_URL}/${id}`, config);
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
