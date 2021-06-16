import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, Route } from 'react-router-dom';
import { connect } from 'react-redux'
// import Forbidden from '../../views/errors/Forbidden';
// import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ roles, element, children, ...rest }) => {
  // const { user, login } = useAuth();

  // if (!user) {
  //   login();
  //   return <></>;
  // }

  // if (roles.length > 0) {
  //   const routeRoles = roles.map((role) => role.toLowerCase());
  //   const userRoles = (user && user.roles ? user.roles : []).map((role) => role.toLowerCase());
  //   if (miscUtils.intersection(routeRoles, userRoles).length === 0) {
  //     return <Forbidden />;
  //   }
  // }
  if (!rest.token) {
    return (
      <Navigate to="/login" />
    )
  }
  return (
    <Route element={element} {...rest}>
      {children}
    </Route>
  );
};

ProtectedRoute.propTypes = {
  // roles: PropTypes.arrayOf(PropTypes.string),
  element: PropTypes.element,
  children: PropTypes.node,
};

ProtectedRoute.defaultProps = {
  roles: [],
  // element: null,
  children: null,
};

// export default ProtectedRoute;

const mapStateToProps = rootState => ({
  token: rootState.authenticationReducer.token
  // posts: rootState.postReducer.posts,
  // loading: rootState.postReducer.loading,
  // errorMessage: rootState.postReducer.errorMessage
})

const mapDispatchToProps = {  }

export default connect(mapStateToProps, mapDispatchToProps)(ProtectedRoute)