import React, { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }: { element: ReactElement }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
