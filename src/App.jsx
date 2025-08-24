import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
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
import SearchResults from './pages/SearchResults';
import BusDetails from './pages/BusDetails';
import AdminRoute from './components/AdminRoute';

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
