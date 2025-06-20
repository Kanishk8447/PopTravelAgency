import React from 'react';
import { Navigate } from 'react-router-dom';

const RedirectIfAuthenticated = ({ children }) => {
  // const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const isAuthenticated = localStorage.getItem('accessToken') !== null && localStorage.getItem('idToken') !== '';
  
  if (isAuthenticated) {
    return <Navigate to="/welcome" replace />;
  }

  return children;
};

export default RedirectIfAuthenticated;
