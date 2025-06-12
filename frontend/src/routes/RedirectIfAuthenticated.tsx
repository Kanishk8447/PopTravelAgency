import React from 'react';
import { Navigate } from 'react-router-dom';

const RedirectIfAuthenticated = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (isAuthenticated) {
    return <Navigate to="/welcome" replace />;
  }

  return children;
};

export default RedirectIfAuthenticated;
