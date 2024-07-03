import React from 'react';
import { Navigate, Route } from 'react-router-dom';

interface PrivateRouteProps {
  element: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem('authToken');

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default PrivateRoute;