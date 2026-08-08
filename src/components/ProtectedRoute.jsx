/**
 * ProtectedRoute.jsx — Role-Based Auth Guard Route Component
 *
 * Checks if a user is authenticated and verifies their user role (recruiter vs candidate).
 * Automatically redirects unauthenticated users to /login.
 * Enforces role-based boundaries to prevent candidates from viewing recruiter dashboard
 * and recruiters from accessing private candidate test flows.
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRole }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Enforce role-based boundaries
  if (allowedRole && user.role !== allowedRole) {
    // If a recruiter tries to access candidate portal, redirect to recruiter app
    if (user.role === 'recruiter') {
      return <Navigate to="/app" replace />;
    }
    // If a candidate tries to access recruiter app, redirect to candidate portal
    if (user.role === 'candidate') {
      return <Navigate to="/candidate" replace />;
    }
  }

  return children;
}
