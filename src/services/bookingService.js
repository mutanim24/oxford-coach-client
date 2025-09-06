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

const getUserBookings = async () => {
  try {
    const response = await api.get('/bookings/my-bookings');
    console.log('Bookings response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
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

// Cancel a booking
const cancelBooking = async (bookingId) => {
  try {
    const response = await api.put(`/bookings/${bookingId}/cancel`);
    return response.data;
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
};

// Get a single booking by ID
const getBookingById = async (bookingId) => {
  try {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching booking by ID:', error);
    throw error;
  }
};

export default {
  createBooking,
  getUserBookings,
  getAllBookings,
  getAllBookingsV2,
  cancelBooking,
  getBookingById
};
