
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AdminDashboard from '../pages/AdminDashboard';
import TenantDashboard from '../pages/TenantDashboard';
import TechnicianDashboard from '../pages/TechnicianDashboard';
import DashboardLayout from '../layouts/DashboardLayout';

// A component to protect routes that require authentication
const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />; // Or to a 'not authorized' page
  }

  return children;
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private routes with dashboard layouts */}
        <Route
          path="/admin-dashboard"
          element={<PrivateRoute requiredRole="admin"><DashboardLayout><AdminDashboard /></DashboardLayout></PrivateRoute>}
        />
        <Route
          path="/tenant-dashboard"
          element={<PrivateRoute requiredRole="tenant"><DashboardLayout><TenantDashboard /></DashboardLayout></PrivateRoute>}
        />
        <Route
          path="/technician-dashboard"
          element={<PrivateRoute requiredRole="technician"><DashboardLayout><TechnicianDashboard /></DashboardLayout></PrivateRoute>}
        />

        {/* A catch-all route to redirect unknown paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
