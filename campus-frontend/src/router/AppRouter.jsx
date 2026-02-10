
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminDashboard from "../pages/AdminDashboard";
import TenantDashboard from "../pages/TenantDashboard";
import TechnicianDashboard from "../pages/TechnicianDashboard";
import DashboardLayout from "../layouts/DashboardLayout";

// A component to protect routes that require authentication
const PrivateRoute = ({ children, requiredRole }) => {
  const { token, role } = useAuth(); // Correctly use token and role

  if (!token) {
    // If there is no token, redirect to the login page.
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // If a role is required and the user's role does not match, redirect to home.
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRouter = () => {
  const { token, role } = useAuth();

  const getDashboardPath = () => {
    switch (role) {
      case "admin":
        return "/admin-dashboard";
      case "tenant":
        return "/tenant-dashboard";
      case "technician":
        return "/technician-dashboard";
      default:
        return "/"; // Fallback
    }
  };

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />

        {/* If logged in, redirect from login/register to the dashboard */}
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to={getDashboardPath()} replace />}
        />
        <Route
          path="/register"
          element={!token ? <Register /> : <Navigate to={getDashboardPath()} replace />}
        />

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
