import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from '../../hooks/useAuth';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/signin" />;
  }
  return children;
};

export default PrivateRoute;

PrivateRoute.propTypes = {
  children: PropTypes.any,
};
