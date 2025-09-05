import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import ManageBuses from './pages/ManageBuses';
import ManageSchedules from './pages/ManageSchedules';
import AllSchedules from './pages/AllSchedules';
import UsersPage from './pages/UsersPage';
import ViewBookings from './pages/ViewBookings';
import BookingPayment from './pages/BookingPayment';
import MyBookings from './pages/MyBookings';
import SearchResults from './pages/SearchResults';
import BusDetails from './pages/BusDetails';
import BookingSummary from './pages/BookingSummary';
import BookingConfirmation from './pages/BookingConfirmation';
import BookingDetails from './pages/BookingDetails';
import AdminRoute from './components/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';
import AboutUs from './pages/About/AboutUs';
import ContactUs from './pages/ContactUs/ContactUs';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY); // Replace with your actual publishable key

function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-16">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/search-results" element={<SearchResults />} />
                <Route path="/bus/:scheduleId" element={<BusDetails />} />
                <Route path="/booking-summary" element={
                  <ProtectedRoute>
                    <Elements stripe={stripePromise}>
                      <BookingSummary />
                    </Elements>
                  </ProtectedRoute>
                } />
                <Route path="/booking-confirmation/:bookingId" element={
                  <ProtectedRoute>
                    <BookingConfirmation />
                  </ProtectedRoute>
                } />
                <Route path="/booking-confirmation" element={
                  <ProtectedRoute>
                    <BookingConfirmation />
                  </ProtectedRoute>
                } />
                <Route path="/booking/:bookingId" element={
                  <ProtectedRoute>
                    <BookingDetails />
                  </ProtectedRoute>
                } />
                <Route path="/my-bookings" element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                } />
                <Route path="/about-us" element={
                  <AboutUs />
                } />
                <Route path="/contact-us" element={
                  <ContactUs />
                } />

                {/* Admin Routes */}
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }>
                  <Route index element={<AdminDashboard />} />
                  <Route path="buses" element={<ManageBuses />} />
                  <Route path="schedules/:busId" element={<ManageSchedules />} />
                  <Route path="all-schedules" element={<AllSchedules />} />
                  <Route path="users" element={<UsersPage />} />
                  <Route path="view-bookings" element={<ViewBookings />} />
                  <Route path="booking-payment" element={<BookingPayment />} />
                </Route>
              </Routes>
            </main>
          </div>
        </Router>
      </SearchProvider>
    </AuthProvider>
  );
}

export default App;
