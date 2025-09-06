import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiCalendar, FiUsers, FiTag, FiFileText, FiAlertTriangle, FiArrowRight, FiBookmark, FiLoader } from 'react-icons/fi';
// Your existing services and components
import bookingService from '../services/bookingService';
import Button from '../components/Button/Button';
import Toast from '../components/Toast/Toast';

// All your original logic remains untouched.
const MyBookings = () => {
  const [bookings, setBookings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [toast, setToast] = React.useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await bookingService.getUserBookings();
        if (response && response.bookings) setBookings(response.bookings);
        else if (response && Array.isArray(response)) setBookings(response);
        else setBookings([]);
      } catch (err) { setError('Failed to fetch bookings. Please try again later.'); }
      finally { setLoading(false); }
    };
    fetchBookings();
  }, []);

  const handleViewDetails = (bookingId) => navigate(`/booking/${bookingId}`);
  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        setLoading(true);
        await bookingService.cancelBooking(bookingId);
        setToast({ show: true, message: 'Booking cancelled successfully', type: 'success' });
        const response = await bookingService.getUserBookings();
        if (response && response.bookings) setBookings(response.bookings);
        else if (response && Array.isArray(response)) setBookings(response);
        else setBookings([]);
      } catch (error) {
        setToast({ show: true, message: 'Failed to cancel booking.', type: 'error' });
      } finally { setLoading(false); }
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const isUpcoming = (departureTime) => new Date(departureTime) > new Date();
  const canCancel = (booking) => booking.status === 'confirmed' && isUpcoming(booking.schedule.departureTime);

  // --- New "Boarding Pass" Themed Component ---
  const BookingTicket = ({ booking }) => {
    const statusStyles = {
      confirmed: { grad: 'from-green-500 to-green-600', text: 'text-green-100', shadow: 'shadow-green-500/30' },
      pending: { grad: 'from-yellow-500 to-yellow-600', text: 'text-yellow-100', shadow: 'shadow-yellow-500/30' },
      cancelled: { grad: 'from-red-500 to-red-600', text: 'text-red-100', shadow: 'shadow-red-500/30' },
      default: { grad: 'from-gray-500 to-gray-600', text: 'text-gray-100', shadow: 'shadow-gray-500/30' },
    };
    const status = booking.status || 'default';
    const styles = statusStyles[status] || statusStyles.default;

    return (
      <motion.div
        variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
        whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
        className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23e9e9e9\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          backgroundBlendMode: 'multiply'
        }}
      >
        {/* Ticket Header */}
        <div className={`bg-gradient-to-r ${styles.grad} text-white p-4 rounded-t-xl flex justify-between items-center shadow-lg ${styles.shadow}`}>
          <div>
            <p className="text-sm font-light uppercase tracking-wider">{booking.bus.operator}</p>
            <p className="font-bold text-xl">{booking.bus.name}</p>
          </div>
          <div className={`px-3 py-1 text-sm font-bold rounded-full ${styles.text} bg-black/20`}>
            {status.toUpperCase()}
          </div>
        </div>

        {/* Ticket Body */}
        <div className="p-6 flex-grow">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-gray-800">{booking.schedule.source}</span>
            <FiArrowRight className="h-6 w-6 text-gray-400 mx-4" />
            <span className="text-3xl font-bold text-gray-800">{booking.schedule.destination}</span>
          </div>
          <div className="text-center text-gray-500 mt-2">PNR: {booking.pnrNumber}</div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-4 mt-6 text-sm">
            <div className="flex items-center"><FiCalendar className="w-5 h-5 mr-2 text-gray-400" /> <div><p className="font-semibold">Date & Time</p><p>{formatDate(booking.schedule.departureTime)}</p></div></div>
            <div className="flex items-center"><FiUsers className="w-5 h-5 mr-2 text-gray-400" /> <div><p className="font-semibold">Seats</p><p>{booking.selectedSeats.join(', ')}</p></div></div>
            <div className="flex items-center"><FiTag className="w-5 h-5 mr-2 text-gray-400" /> <div><p className="font-semibold">Total Fare</p><p className="font-bold text-green-600">${booking.totalFare}</p></div></div>
            <div className="flex items-center"><FiBookmark className="w-5 h-5 mr-2 text-gray-400" /> <div><p className="font-semibold">Bus Type</p><p>{booking.bus.busType}</p></div></div>
          </div>
        </div>

        {/* Ticket Stub / Actions */}
        <div className="border-t-2 border-dashed border-gray-300 p-4 bg-gray-50 rounded-b-xl flex justify-end items-center gap-4">
          {canCancel(booking) && (
            <Button onClick={() => handleCancelBooking(booking._id)} className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors">Cancel</Button>
          )}
          <Button onClick={() => handleViewDetails(booking._id)} className="bg-gray-800 hover:bg-black text-white font-bold py-2 px-5 rounded-lg text-sm transition-colors shadow-md">Details</Button>
        </div>
      </motion.div>
    );
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <FiLoader className="h-12 w-12 mx-auto text-green-500 animate-spin" />
        <p className="mt-4 text-lg font-semibold text-gray-600">Fetching Your Adventures...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full text-center border-t-4 border-red-500">
        <FiAlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">An Error Occurred</h2>
        <p className="mt-2 text-gray-600">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">Try Again</Button>
      </div>
    </div>
  );

  const upcomingBookings = bookings.filter(b => isUpcoming(b.schedule.departureTime)).sort((a, b) => new Date(a.schedule.departureTime) - new Date(b.schedule.departureTime));
  const pastBookings = bookings.filter(b => !isUpcoming(b.schedule.departureTime)).sort((a, b) => new Date(b.schedule.departureTime) - new Date(a.schedule.departureTime));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div className="mb-12 text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-gray-800 tracking-tight">My Bookings</h1>
          <p className="mt-2 text-lg text-gray-600">Your personal travel history and upcoming adventures.</p>
        </motion.div>

        {bookings.length === 0 ? (
          <motion.div className="bg-white rounded-xl shadow-2xl p-12 text-center border-t-4 border-green-500" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <FiFileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800">No Journeys Found</h2>
            <p className="mt-2 text-gray-600 max-w-md mx-auto">Your travel story with us is waiting to begin. Let's find your next destination!</p>
            <Button onClick={() => navigate('/')} className="mt-8 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-base shadow-lg hover:shadow-xl transition-all">Start Booking Now</Button>
          </motion.div>
        ) : (
          <motion.div className="space-y-16" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} initial="hidden" animate="visible">
            {upcomingBookings.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-green-500">Upcoming Trips</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {upcomingBookings.map((booking) => <BookingTicket key={booking._id} booking={booking} />)}
                </div>
              </section>
            )}

            {pastBookings.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-gray-300">Past Journeys</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {pastBookings.map((booking) => (
                    <div key={booking._id} className="grayscale opacity-75 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                      <BookingTicket booking={booking} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </motion.div>
        )}
      </div>

      {toast.show && (
        <div className="fixed bottom-4 right-4 z-50">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast({ show: false, message: '', type: '' })} />
        </div>
      )}
    </div>
  );
};

export default MyBookings;