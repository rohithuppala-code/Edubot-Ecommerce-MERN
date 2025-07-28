import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { state } = useUser();

  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && state.user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};