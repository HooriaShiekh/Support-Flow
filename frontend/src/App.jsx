import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import CustomerDashboard from './pages/CustomerDashboard';
import MyTickets from './pages/MyTickets';
import WorkerDashboard from './pages/WorkerDashboard';
import AdminDashboard from './pages/AdminDashboard'; // 🌟 Admin Dashboard import kar liya
import HelpCenter from './pages/HelpCenter';
import About from './pages/About';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#070403] text-[#f4eae3] font-sans">
        <Routes>
          {/* Root URL ko automatic /home par bhejne ke liye */}
          <Route path="/" element={<Navigate to="/home" replace />} />
{/* Existing routes */}
  <Route path="/help" element={<HelpCenter />} />
          {/* Default Route */}
          <Route path="/home" element={<Home />} />        
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
      
          {/* Dashboards */}
          <Route path="/user-dashboard" element={<CustomerDashboard />} />
          <Route path="/my-tickets" element={<MyTickets />} />
          <Route path="/worker-dashboard" element={<WorkerDashboard />} />

          {/* Public Routes */}
  <Route path="/about" element={<About />} />
          
          {/*  Admin Dashboard Route */}
          <Route path="/AdminDashboard" element={<AdminDashboard />} />         
                 
          {/* Fallback */}
          <Route path="*" element={<div className="p-10 text-center text-white">404 - Page Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;