import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Import Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Import Pages
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails'; 
import PostJob from './pages/PostJob';

// Import Auth Pages
import Register from './pages/Register';
import LoginSelection from './pages/LoginSelection';
import Login from './pages/Login';
import EmployerLogin from './pages/EmployerLogin';
import AdminLogin from './pages/AdminLogin';
import Logout from './pages/Logout'; // <--- NEW IMPORT FIXED THE BLANK SCREEN

// Import Dashboards
import SeekerDashboard from './pages/SeekerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Helper to reset scroll when changing pages
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      
      {/* bg-[#0f172a] = Deep space navy background 
          text-white = Global text color
      */}
      <div className="flex flex-col min-h-screen bg-[#0f172a] text-white selection:bg-brand-pink selection:text-white">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/job/:id" element={<JobDetails />} /> 
            <Route path="/post-job" element={<PostJob />} />

            {/* Login & Auth Routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<LoginSelection />} />
            <Route path="/login/seeker" element={<Login />} />
            <Route path="/employer-login" element={<EmployerLogin />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/logout" element={<Logout />} />

            {/* Dashboard Routes */}
            <Route path="/seeker-dashboard" element={<SeekerDashboard />} />
            <Route path="/employer-dashboard" element={<EmployerDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;