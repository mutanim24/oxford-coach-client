import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bookingService from '../services/bookingService';
import AdminLayout from '../components/AdminLayout';
import Button from '../components/Button/Button';
import Toast from '../components/Toast/Toast';

const BookingPayment = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalAmount: 0
  });
  
  const navigate = useNavigate();

  // Calculate date range based on filter
  const getDateRange = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    switch (filter) {
      case 'this-month':
        return {
          start: new Date(currentYear, currentMonth, 1),
          end: new Date(currentYear, currentMonth + 1, 0, 23, 59, 59)
        };
      case 'last-month':
        return {
          start: new Date(currentYear, currentMonth - 1, 1),
          end: new Date(currentYear, currentMonth, 0, 23, 59, 59)
        };
      case 'last-3-months':
        return {
          start: new Date(currentYear, currentMonth - 2, 1),
          end: new Date(currentYear, currentMonth + 1, 0, 23, 59, 59)
        };
      default:
        return {
          start: new Date(0), // Beginning of time
          end: new Date() // Current time
        };
    }
  };

  // Filter bookings based on selected filter
  const filterBookings = (allBookings) => {
    const { start, end } = getDateRange();
    
    return allBookings.filter(booking => {
      const bookingDate = new Date(booking.createdAt);
      return bookingDate >= start && bookingDate <= end;
    });
  };

  // Calculate statistics
  const calculateStats = (filteredBookings) => {
    const totalBookings = filteredBookings.length;
    const totalAmount = filteredBookings.reduce((sum, booking) => sum + booking.totalFare, 0);
    
    return { totalBookings, totalAmount };
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // Try to get bookings from BookingV2 collection first
      let response;
      try {
        response = await bookingService.getAllBookingsV2();
      } catch {
        // Fallback to regular bookings if BookingV2 fails
        console.log('BookingV2 not available, falling back to regular bookings');
        response = await bookingService.getAllBookings();
      }
      
      const allBookings = response.bookings || [];
      
      // Apply filter
      const filteredBookings = filterBookings(allBookings);
      setBookings(filteredBookings);
      
      // Calculate stats
      const newStats = calculateStats(filteredBookings);
      setStats(newStats);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      // You could show a toast notification here if needed
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getPaymentStatusBadge = (paymentStatus) => {
    if (!paymentStatus) {
      return (
        <span className="inline-flex rounded-full px-2 text-xs font-semibold leading-5 bg-gray-100 text-gray-800">
          No Payment Info
        </span>
      );
    }
    
    if (paymentStatus === 'succeeded') {
      return (
        <span className="inline-flex rounded-full px-2 text-xs font-semibold leading-5 bg-green-100 text-green-800">
          Paid
        </span>
      );
    } else if (paymentStatus === 'pending') {
      return (
        <span className="inline-flex rounded-full px-2 text-xs font-semibold leading-5 bg-yellow-100 text-yellow-800">
          Pending
        </span>
      );
    } else {
      return (
        <span className="inline-flex rounded-full px-2 text-xs font-semibold leading-5 bg-red-100 text-red-800">
          Failed
        </span>
      );
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading bookings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Booking & Payment</h1>
            <p className="mt-2 text-sm text-gray-700">
              A comprehensive list of all bookings with payment details.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-4">
            <div className="inline-flex rounded-md shadow-sm">
              <Button
                onClick={() => navigate('/admin-dashboard')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Booked Tickets</h2>
            <p className="text-3xl font-bold text-blue-600">{stats.totalBookings}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Amount</h2>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(stats.totalAmount)}</p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter by Month</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('this-month')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                filter === 'this-month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setFilter('last-month')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                filter === 'last-month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Last Month
            </button>
            <button
              onClick={() => setFilter('last-3-months')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                filter === 'last-3-months'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Last 3 Months
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Time
            </button>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        PNR
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        User
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Route
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Departure
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Seats
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Booking Status
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Payment Status
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Amount
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Payment Date
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {bookings.length === 0 ? (
                      <tr>
                        <td colSpan="10" className="py-12 text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {filter === 'all' 
                              ? 'No bookings have been made yet.' 
                              : `No bookings found for the selected period.`
                            }
                          </p>
                        </td>
                      </tr>
                    ) : (
                      bookings.map((booking) => (
                        <tr key={booking._id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {booking.pnrNumber}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div>
                              <div className="font-medium text-gray-900">{booking.user.name}</div>
                              <div className="text-gray-500">{booking.user.email}</div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div>
                              <div className="font-medium">{booking.schedule.source}</div>
                              <div className="text-gray-500">to {booking.schedule.destination}</div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {formatDate(booking.schedule.departureTime)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {booking.selectedSeats.join(', ')}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4">
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              booking.status === 'confirmed' 
                                ? 'bg-green-100 text-green-800' 
                                : booking.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4">
                            {getPaymentStatusBadge(booking.paymentStatus)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {formatCurrency(booking.totalFare)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {booking.paymentDate ? formatDate(booking.paymentDate) : '-'}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              onClick={() => navigate(`/booking/${booking._id}`)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast.show && (
        <div className="fixed bottom-4 right-4 z-50">
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast({ show: false, message: '', type: '' })}
          />
        </div>
      )}
    </AdminLayout>
  );
};

export default BookingPayment;
