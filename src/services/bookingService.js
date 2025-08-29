import api from './api';

// Create a new booking
const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

// Get all bookings for the authenticated user
const getUserBookings = async () => {
  try {
    const response = await api.get('/bookings/my-bookings');
    return response.data;
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};

// Get all bookings (admin only)
const getAllBookings = async () => {
  try {
    const response = await api.get('/bookings/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    throw error;
  }
};

// Get all bookings from BookingV2 collection (admin only)
const getAllBookingsV2 = async () => {
  try {
    const response = await api.get('/bookings/bookingv2');
    return response.data;
  } catch (error) {
    console.error('Error fetching all bookings from BookingV2:', error);
    throw error;
  }
};

export default {
  createBooking,
  getUserBookings,
  getAllBookings,
  getAllBookingsV2
};
